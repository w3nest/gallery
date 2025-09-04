# Utilities

This page gathers a couple utilities for plotting using the library <a target='_blank' href='https://d3js.org/'>d3</a>.

<js-cell>

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
</js-cell>


<js-cell>
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