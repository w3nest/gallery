
# **Demo**  

<note level="hint" >
This page presents a **notebook-style interface** to demonstrate the **on-demand installation** of resources.
It offers insights into the underlying mechanics at a low level. Though it may not appear so, this is fully a web 
application, showcasing how such applications can be built using W3Nest.

However, applications are typically developed using a **standard tech stack**, which **W3Nest does not interfere with**. 
The code bit itself remains agnostic to W3Nest, unless you choose to leverage W3Nest-specific features.
</note>

## **Solving the TDSE 1D**  

Our goal is to solve the **time-dependent Schrödinger equation (TDSE) in 1D**, governed by the Hamiltonian 
\\( \hat{H} \\):  

$$
\hat{H} = -\frac{\hbar^2}{2m} \frac{d^2}{dx^2} + V(x)
$$

where:  
- \\( \hbar \\) is the reduced Planck’s constant,  
- \\( m \\) is the particle's mass,  
- \\( V(x) \\) represents the potential energy,  
- \\( -\frac{\hbar^2}{2m} \frac{d^2}{dx^2} \\) is the kinetic energy operator.  

---

## **Required Modules & Backend Installation**  

For UI rendering and plotting, we use two **ESM modules**—**rxjs** and **d3**—along with 
a **computation backend**: **w3gallery_tdse1d**.  

### **Installing Dependencies**  

<js-cell>  
const { installWithUI } = await webpm.installViewsModule();  

const { tdse1d, rxjs, d3 } = await installWithUI({  
    esm: [  
        'rxjs#^7.5.6 as rxjs',   
        'd3#^7.7.0 as d3',
        'chart.js#^3.9.1 as chartJs'
    ],  
    backends: [  
        'w3gallery_tdse1d#^0.1.0 as tdse1d'  
    ],  
    display  
});  
chartJs.Chart.register(...chartJs.registerables);
</js-cell>  

<note level="warning" title="Dynamic Installer">  

The variable `webpm` refers to the JavaScript client **`@w3nest/webpm-client`**, which handles dynamic resource 
installation.  

When installing resources, **dependencies are resolved** using **semantic versioning**.  
Both direct and indirect dependencies—whether for **ESM modules, backends, or Pyodide packages**—are 
**automatically fetched and linked at runtime**.  

For more details, refer to the client documentation <ext-link target="webpm">here</ext-link>.  

</note>

The **backend** is a standard **Python-based FastAPI service**, and its API documentation is accessible here:  

<js-cell>  
display({
    tag:'a', 
    target:'_blank', 
    href: `${tdse1d.urlBase}/docs`,
    innerText:'API Documentation'
})  
</js-cell>  

---

**Backend Functionality**  

The backend provides two key endpoints:  
- **`schrodinger/eigen-states`** → Computes the eigenstates of the system.  
- **`schrodinger/tdse-1d`** → Simulates the time evolution of the wavefunction.  


### **Visualization Utilities**  

Before proceeding to computations, the following expandable section provides **plotting utilities** 
for visualizing potential functions and wavefunctions.  

<note level="info" icon="fas fa-code" title="Plots" expandable="true" mode="stateful">  
<js-cell>  

function chartJsPlot({elem, grid, input$}) {
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
function init_scale({ elem, V }) {  
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
function init_plot({ elem, eigenStates, V, grid}) {  
    const { xScale, yScale, ePlotMax } = init_scale({ elem, V });  

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
function draw({ plot, state, update, coef }) {  
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
</note>  


---

## **Simulation Scenarios**  

The next expandable section defines three different **quantum scenarios**:  
1. **Harmonic Potential** → A classic harmonic oscillator.  
2. **Gaussian Well** → A localized Gaussian potential well.  
3. **Tunneling Effect** → A double-well potential to explore quantum tunneling.  

📌 **Expand the next section for detailed regarding the 3 scenario.**


<note level="info" icon="fas fa-code" title="Scenario" expandable="true" mode="stateful">
<js-cell>

function gaussianWell({ depth, mean, sigma }) {
    return (x) =>
        depth *
        (1 - Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2))))
}
const scenarios = {
    harmonic: {
        V: (x) => 1e4 * (x - 0.5) ** 2,
        tFinal: 1,
        dt: 0.002,
        yScaleTDSE: 3,
        psi0: {
            x0: 0.4,
            sigma: 0.05,
        },
    },
    gaussian: {
        V: gaussianWell({ depth: 1e4, mean: 0.5, sigma: 0.1 }),
        tFinal: 0.1,
        dt: 0.0002,
        yScaleTDSE: 3,
        psi0: {
            x0: 0.45,
            sigma: 0.05,
        },
    },
    tunneling: {
        V: (x) =>
            gaussianWell({ depth: 1e4, mean: 0.25, sigma: 0.1 })(x) +
            gaussianWell({ depth: 3e4, mean: 0.6, sigma: 0.1 })(x),
        tFinal: 0.05,
        dt: 0.0001,
        yScaleTDSE: 3,
        psi0: {
            x0: 0.2,
            sigma: 0.05,
        },
    },
}
</js-cell>
</note>

### **Defining Problem Inputs**  

Before solving the Schrödinger equation, we need to define the **problem parameters**:  

- **`numPoints`** → Number of spatial discretization points, defining the grid resolution.  
- **`scenario`** → The selected potential scenario.  
- **`V`** → The potential energy values on the grid.  

To allow switching between different scenarios dynamically, we use a **dropdown widget**:  

<js-cell>  
const numPoints = 500;  

const grid = Array.from({ length: numPoints }, (_, i) => i / (numPoints - 1));  

let dropdown = new Views.DropDown({  
    items: {  
        harmonic: scenarios.harmonic,  
        gaussian: scenarios.gaussian,  
        tunneling: scenarios.tunneling  
    },  
    selected: 'tunneling'  
});  

display(dropdown);  

const input$ = dropdown.value$.pipe(  
    rxjs.map((scenario) => ({  
        scenario,  
        V: grid.map(scenario.V)  
    }))  
);  
display({
    tag: 'div',
    class:`border text-center rounded p-2 flex-grow-1 w-100 h-100`,
    children: [
        {
            tag:'canvas',
            class:'mx-auto w-75 h-100',
            connectedCallback: (elem) => {
                const plot = chartJsPlot({elem, grid, input$})
            },
            disconnectedCallback: (elem) =>  elem.onDisconnected()
        }
    ]
})
</js-cell>  
 

---

## Computing Eigenstates and Eigenvalues

To analyze the quantum system, we first determine the **eigenstates** and **energy levels** by solving the stationary 
Schrödinger equation:

$$
\hat{H} \psi_n(x) = E_n \psi_n(x)
$$
which expands to:

$$
-\frac{\hbar^2}{2m} \frac{d^2 \psi_n(x)}{dx^2} + V(x) \psi_n(x) = E_n \psi_n(x)
$$

where:  
- \\( \psi_n(x) \\) = eigenstates (stationary wavefunctions),  
- \\( E_n \\) = eigenvalues (energy levels).  


### Computing and Visualizing Eigenstates


<js-cell reactive="true">

const {V, scenario} = input$
const { eigenStates } = await tdse1d.fetchJson('schrodinger/eigen-states', {
    method: 'post',
    body: JSON.stringify({
        basisSize: 50,
        ePot: V,
    }),
    headers: { 'content-type': 'application/json' },
})

const computed$ = {
    eigenStates,
    scenario,
    V
}
const view = Views.Layouts.single({
   content:{
        tag:'div',
        class: 'p-2 w-100 h-100 bg-light border rounded',
        connectedCallback: (elem) => {            
            const plot = init_plot({elem, eigenStates, V, grid})

            eigenStates
            .filter( state => state.energy < plot.ePlotMax)
            .forEach((state) => draw({ plot, state }))
        }
    }
})
display(view)
</js-cell>

## Time dependant results

Let's now solve the **full time-dependent Schrödinger equation (TDSE)**:

$$
i\hbar \frac{\partial \Psi(x,t)}{\partial t} = \hat{H} \Psi(x,t)
$$

If we expand it using the Hamiltonian:

$$
i\hbar \frac{\partial \Psi(x,t)}{\partial t} = -\frac{\hbar^2}{2m} \frac{d^2 \Psi(x,t)}{dx^2} + V(x) \Psi(x,t)
$$


<js-cell reactive="true">
const { scenario, V, eigenStates } = computed$
const body = {
    method: 'post',
    body: JSON.stringify({
        basisSize: 200,
        tFinal: scenario.tFinal,
        dt: scenario.dt,
        ePot: V,
        psi0: scenario.psi0,
    }),
    headers: { 'content-type': 'application/json' },
}

const resp = await tdse1d.fetchJson('schrodinger/tdse-1d', body)

const view = Views.Layouts.superposed({
    topLeft: dropdown,
    content: {
        tag:'div',
        class: 'p-2 w-100 h-100 bg-light border rounded',
        connectedCallback: (elem) => {
            const plot = init_plot({elem, eigenStates, V, grid})

            eigenStates
            .filter( state => state.energy < plot.ePlotMax)
            .forEach((state) => draw({ plot, state }))

            let psiMax
            const sub = rxjs.timer(0, 100).subscribe((i) => {
                const index = i % (resp.quantumStates.length - 1)
                const state = resp.quantumStates[index]
                psiMax = psiMax || d3.max(state.pdf)
                draw({ plot, state, update: true, coef: scenario.yScaleTDSE })

                const classical = resp.classicalStates[index]
                plot.svg.select('.classical')
                    .attr('cx', () => plot.xScale(classical.x))
                    .attr('cy', () => plot.yScale(classical.energy))
                    .attr('r', 5)
            })
            elem.ownSubscriptions(sub)
        }
    },
})

display(view)

</js-cell>

## Pyodide


The W3Nest environment also manages <ext-link target="pyodide">Pyodide</ext-link> installation: a python interpreter 
running in the browser. It can leverage all pure python wheels from PyPI, as well as a numerous 
<ext-link target="pyodide-packages">C/C++/Fortran based package </ext-link> (e.g. numpy, scikitlearn, pandas, 
matplotlib, *etc.*).

An example is provide on <cross-link target="tdse-1d">this page</cross-link>, that explains the details of 
the numerical resolution of the TDSE-1D.
