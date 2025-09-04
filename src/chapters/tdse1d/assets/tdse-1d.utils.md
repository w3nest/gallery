# Utilities

This page collects **helper functions** for plotting quantum simulation results using either:

* <ext-link target="tdse-1d.d3js">D3</ext-link> — for direct SVG-based rendering of potentials, eigenstates, 
  and time-dependent wavefunctions.
* <ext-link target="tdse-1d.chartjs">Chart.js</ext-link> — for simple, responsive line plotting.

⚠️ **Note**: There is some functional overlap between the utilities below. Both approaches implement potential plotting 
and wavefunction visualization; a future refactor should unify them into a consistent API.


<js-cell>
// Used in the pyodide page
const initChart = (element, grid, V, d3) => {
    const svg = d3.select(element)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')

    const width = element.offsetWidth
    const height = element.offsetHeight
    const xScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([50, width - 50])
    const ePlotMin = d3.min(V)
    const ePlotMax = d3.max(V) + 0.1 * (d3.max(V) - d3.min(V))
    const yScale = d3
        .scaleLinear()
        .domain([ePlotMin, ePlotMax])
        .range([height - 50, 50])

    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale).ticks(0))
    
    svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .call(d3.axisLeft(yScale).ticks(0))
    const epotPlt = d3
        .line()
        .x((d, i) => xScale(grid[i]))
        .y((d, i) => yScale(V[i]))
        .curve(d3.curveLinear)

    svg.append('path').datum(V).attr('class', 'line').attr('d', epotPlt)
    .attr('fill', 'none')
    .attr('stroke', 'black')

    svg.append('path').datum([]).attr('class', 'psi')

    return {
        xScale,
        yScale,
        Vmin:ePlotMin,
        Vmax:ePlotMax,
        svg,
        grid
    }
}

const plot = ({ chart, state, update, pdfScale, coef, d3 }) => {
    const y0 = chart.yScale(state.energy)
    let line = d3
        .line()
        .x((d, i) => chart.xScale(chart.grid[i]))
        .y((d) => y0 + coef * pdfScale(d))
    if (update) {
        chart.svg.select('.psi').datum(state.pdf)
        .attr('d', line)
        .attr('fill', 'rgba(70, 130, 180, 0.86)')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        return
    }
    chart.svg.append('path')
        .datum(state.pdf)
        .attr('d', line)
        .attr('class', 'eigenstate')
        .attr('fill', 'rgba(70, 130, 180, 0.1)')
        .attr('stroke', 'rgba(70, 130, 180, 0.3)')
        .attr('stroke-width', 2)
}
</js-cell>



<js-cell>
// Used in the backend page
function chartJsPlot({elem, grid, input$, chartJs}) {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend: {
                display: false
            }
        }
    }
    const plot = new chartJs.Chart(
        elem, 
        { 
            type: 'line',
            options: chartOptions,
            data: { 
                labels: grid.map((_,i) => i ),
                datasets: [{
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    data: []
                }] 
            }
        }
    )
    elem.ownSubscriptions(
        input$.subscribe( ({V}) => {
            plot.data.datasets[0].data = V
            plot.update()
        })
    )

    elem.onDisconnected = () => plot.clear()
    return plot
}


// **Initialize coordinate scales**  
function init_scale({ elem, V, d3 }) {  
    const width = elem.offsetWidth;  
    const height = elem.offsetHeight;  

    const xScale = d3  
        .scaleLinear()  
        .domain([0, 1])  
        .range([50, width - 50]);  

    const ePlotMin = d3.min(V);  
    const ePlotMax = d3.max(V) + 0.1 * (d3.max(V) - d3.min(V));  
    const yScale = d3  
        .scaleLinear()  
        .domain([ePlotMin, ePlotMax])  
        .range([height - 50, 50]);  

    return { xScale, yScale, ePlotMax };  
}  

// **Initialize the plot with potential and energy levels**  
function init_plot({ elem, eigenStates, V, grid, d3}) {  
    const { xScale, yScale, ePlotMax } = init_scale({ elem, V, d3 });  

    const pdf0Max = d3.max(eigenStates[0].pdf);  
    const deltaE0 = yScale(eigenStates[1].energy) - yScale(eigenStates[0].energy);  
    const pdfScale = d3.scaleLinear().domain([0, pdf0Max]).range([0, deltaE0]);  

    const svg = d3.select(elem).append('svg')  
        .attr('width', '100%')  
        .attr('height', '100%');  

    const epotPlt = d3  
        .line()  
        .x((d, i) => xScale(grid[i]))  
        .y((d, i) => yScale(V[i]))  
        .curve(d3.curveLinear);  

    svg.append('path').datum(V).attr('class', 'line').attr('d', epotPlt);  

    svg.append('g')  
        .attr('transform', `translate(0, ${yScale(0)})`)  
        .call(d3.axisBottom(xScale).ticks(0));  

    svg.append('g')  
        .attr('transform', `translate(50, 0)`)  
        .call(d3.axisLeft(yScale).ticks(0));  

    svg.append('path').datum([]).attr('class', 'psi');  

    svg.append('circle').attr('class', 'classical').attr('id', 'classical');  

    return { svg, xScale, yScale, pdfScale, ePlotMax, grid };  
}  

// **Draw wavefunctions on the plot**  
function draw({ plot, state, update, coef, d3 }) {  
    const { svg, xScale, yScale, pdfScale } = plot;  
    const y0 = yScale(state.energy);  
    coef = coef ?? 1;  
    update = update ?? false;  

    let line = d3  
        .line()  
        .x((d, i) => xScale(plot.grid[i]))  
        .y((d) => y0 + coef * pdfScale(d));  

    if (update) {  
        svg.select('.psi').datum(state.pdf).attr('d', line);  
        return;  
    }  

    svg.append('path')  
        .datum(state.pdf)  
        .attr('d', line)  
        .attr('class', 'eigenstate');  
}  

</js-cell> 
