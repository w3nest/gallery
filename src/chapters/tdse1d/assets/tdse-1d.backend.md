
# Backend Resolution of TDSE 1D

This page demonstrates the numerical resolution of the **time-dependent Schrödinger equation (TDSE) in one dimension**, 
using a **dedicated backend** that can be installed on your local machine when needed.

For theoretical background and details on the numerical methods, please refer to the parent page.

<note level="warning" title="Not available online"> 
This page requires execution via the <ext-link target="tdse-1d.w3nest">W3Nest</ext-link> local server.
The server enables the installation and use of the custom backend required for these simulations.
</note>


## **Required Modules & Backend Installation**  

The setup requires both frontend and backend components:
*  **UI rendering and plotting** rely on two ESM modules: <ext-link target="tdse-1d.d3js">D3</ext-link> 
   and <ext-link target="tdse-1d.chartjs">Chart.js</ext-link> .
*  Computation is handled by the backend package <github-link target="tdse-1d.backend">w3gallery_tdse1d</github-link>.


<js-cell>  
const { installWithUI } = await webpm.installViewsModule();  
const { rxjs } = await webpm.install({esm:[ 'rxjs#^7.5.6 as rxjs' ]})

const { tdse1d, d3, chartJs } = await installWithUI({  
    esm: [   
        'd3#^7.7.0 as d3',
        'chart.js#^3.9.1 as chartJs'
    ],  
    backends: [  
        'w3gallery_tdse1d#^0.1.0 as tdse1d'  
    ],  
    display: (view) => {
        display(view)
        const done$ = view.eventsMgr.event$.pipe(
            rxjs.filter( (ev) => ev.step === 'InstallDoneEvent')
        )
        Views.notify({
            level: 'warning',
            content: view,
            done$
        })
    }
});  
chartJs.Chart.register(...chartJs.registerables);

// load drawing utils
const { chartJsPlot, init_plot, draw  } = await load("/tdse-1d/utils")

</js-cell>  

<note level="info" title="Backend Spec." expandable="true">

The backend is implemented as a **Python FastAPI service** and exposes two main endpoints:
- **`schrodinger/eigen-states`** → Computes the system’s eigenstates.
- **`schrodinger/tdse-1d`** → Simulates the time evolution of the wavefunction.  

You can explore the HTTP API documentation here: 

<js-cell>  
display({
    tag:'a', 
    target:'_blank', 
    href: `${tdse1d.urlBase}/docs`,
    innerText:'API Documentation'
})  
</js-cell>  

The backend's code API documentation is provided <cross-link target="tdse-1d.backend.api">here</cross-link>.

</note>

---

## **Simulation Scenarios**  

In this section, we define three distinct **quantum-mechanical scenarios** that illustrate fundamental phenomena 
in one-dimensional quantum dynamics:
1. **Harmonic Potential** → Models a quantum harmonic oscillator, a cornerstone of quantum theory with equally 
   spaced energy levels.
2. **Gaussian Well** → Represents a localized potential well where a particle can be trapped, useful for studying 
   bound states.
3. **Tunneling Effect** → Implements a double-well potential to explore quantum tunneling, where the wavefunction 
   leaks through classically forbidden regions.

📌 **Expand the panel below to view the potential definitions and initial conditions used for each scenario.**

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
        dt: 0.0002,
        yScaleTDSE: 3,
        psi0: {
            x0: 0.2,
            sigma: 0.05,
        },
    },
}
</js-cell>
</note>

Before solving the Schrödinger equation numerically, we must specify the **discretization and scenario setup**:

* `numPoints` → Number of spatial discretization points, which sets the resolution of the simulation grid.
* `scenario` → The chosen potential (harmonic, Gaussian, or tunneling).
* `V` → The potential energy profile evaluated across the grid.

To allow interactive switching between scenarios, we provide a **dropdown selector**. 
Choosing a scenario dynamically updates the plotted potential.

<js-cell>  
const numPoints = 500;  

const grid = Array.from({ length: numPoints }, (_, i) => i / (numPoints - 1));  

const dropdown = new Views.Select({  
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
                const plot = chartJsPlot({elem, grid, input$, chartJs})
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

<js-cell reactive="true">

let { V, scenario } = input$
let { eigenStates } = await tdse1d.fetchJson('schrodinger/eigen-states', {
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
display(
    Views.Layouts.single({
        content:{
            tag:'div',
            class: 'p-2 w-100 h-100 bg-light border rounded',
            connectedCallback: (elem) => {            
                const plot = init_plot({elem, eigenStates, V, grid, d3})

                eigenStates
                .filter( state => state.energy < plot.ePlotMax)
                .forEach((state) => draw({ plot, state, d3 }))
            }
        }
    })
)
</js-cell>

## Time dependant results

Let's now solve the **full time-dependent Schrödinger equation (TDSE)**:

<js-cell reactive="true">
let { scenario, V, eigenStates } = computed$;
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

display(
    Views.Layouts.superposed({
        topLeft: dropdown,
        content: {
            tag:'div',
            class: 'p-2 w-100 h-100 bg-light border rounded',
            connectedCallback: (elem) => {
                const plot = init_plot({elem, eigenStates: eigenStates, V: V, grid, d3})

                eigenStates
                .filter( state => state.energy < plot.ePlotMax)
                .forEach((state) => draw({ plot, state, d3 }))

                let psiMax
                const sub = rxjs.timer(0, 100).subscribe((i) => {
                    const index = i % (resp.quantumStates.length - 1)
                    const state = resp.quantumStates[index]
                    psiMax = psiMax || d3.max(state.pdf)
                    draw({ plot, state, update: true, coef: scenario.yScaleTDSE, d3 })

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
)

</js-cell>
