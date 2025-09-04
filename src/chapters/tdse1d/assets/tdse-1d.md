# 1D Schrödinger Equation / *t*

This page explains the resolution of the 1D Time-Dependent Schrödinger Equation (TDSE-1D) using numerical methods.

The preview of the application in action is presented below, it is a deported view from the last cell of this page.

<cell-output cell-id="final-view" full-screen="true" defaultClass="w-100">
<div class="w-100 text-center border rounded p-2" style="aspect-ratio:1">
    <i>This view will be updated when ready.</i>
    <i class="fas fa-spinner fa-spin"></i>
</div>
</cell-output>

## Introduction

This page is powered by Python code running directly in your browser, made possible through 
<a traget="_blank" href="https://pyodide.org/en/stable/">Pyodide</a>, 
a Python distribution for the web. 
To ensure the user interface remains responsive, computations are executed in a separate thread via a Web Worker.

Visualization is handled using <a target='_blank' href='https://d3js.org/'>d3</a>, with plots generated dynamically 
(for more details, visit the <a href="@nav/sciences/tdse-1d/utils">/Utilities</a>). 
Additionally, animations and interactivity are managed using <a target="_blank" href="https://rxjs.dev/">RxJS</a>, 
a library for reactive programming.

The following cell installs the required dependencies.

<js-cell>
const { rxjs, d3 } = await webpm.install({
    esm:[
        'rxjs#^7.5.6 as rxjs', 
        'd3#^7.7.0 as d3'
    ]
})
const done$ = new rxjs.Subject()
Views.notify({
    content: {
        tag: 'div',
        class: 'p-3',
        innerText: 'Installing Python Env. in Worker...'
    },
    level: 'info',
    done$
})

const { WorkersPool } = await webpm.installWorkersPoolModule()
const pyPool = new WorkersPool({
    install:{
        pyodide: {
            version: "0.26.2",
            modules: ["numpy"]
        }
    },
    pool: { startAt: 1, stretchTo: 1 }
})
const { initChart, plot } = await load("/tdse-1d/utils")
const { WorkersPoolView } = await webpm.installViewsModule()

const pyPoolView = new WorkersPoolView({ workersPool: pyPool  })
display(pyPoolView)
await pyPool.ready()
done$.next(true)
</js-cell>

<note level="hint">
In the following, all equations are expressed in a **unit-less** (non-dimensional) system.
</note>

The time-dependent Schrödinger equation is given by:
$$
i\frac{d}{dt}|\psi(t)>=\hat{H}|\psi(t)>
$$
This equation describes the evolution of the wave function over time.
It predicts that wave functions can form standing waves, known as **stationary states**. 
These stationary states are particularly important, as studying them individually simplifies the task of solving 
the time-dependent Schrödinger equation for any arbitrary state.

The eigenstates of the Hamiltonian form a complete basis and are defined by the time-independent Schrödinger equation:
$$
\hat{H}|\phi> = E|\phi>
$$

In one-dimensional space, the Hamiltonian for a particle in a potential energy field \\(V(x)\\) is:
$$
\hat{H} = \hat{T} + \hat{V} = -\frac{d^2}{2dx^2} + V(x)
$$

The eigenstates \\(\phi(x)\\) of this system satisfy:
$$
-\frac{d^2\phi}{2dx^2} + V(x)\phi = E \phi
$$

## Eigenstates & Eigenvalues

To find the eigenstates and eigenvalues, we use the Finite Difference Method (FDM) to discretize the equation on a grid 
of size \\(N\\).
We assume the particle is confined within a box, enforcing boundary conditions such that the wave function vanishes 
at the edges of the box:
$$
\phi_0=\phi_N=0
$$

the second derivative of the wave function, \\(-\frac{d^2\phi}{2dx^2}\\), can be approximate by using the central 
difference formula:
$$
\frac{d^2\phi}{dx^2} \approx \frac{\phi_{i-1}-2\phi_i+\phi_{i+1}}{dx^2}
$$
Here, \\(\phi_i\\) is the value of \\(\phi\\) on the \\(i\\)th point of the grid.

Given the potential \\(V_i\\) at each point of the grid, the discretized form of the Schrödinger equation becomes:
$$
-\frac{\phi_{i-1}}{2dx^2}+\frac{\phi_{i}}{dx^2}-\frac{\phi_{i+1}}{2dx^2} + V_i\phi_i = E \phi_i \quad 
\forall i \in [1, N-1] 
$$

This is a matrix eigenvalue problem. The Hamiltonian \\(H_{ij}\\) is represented as a tri-diagonal matrix, where:
*  The **diagonal elements** are defined as:
  $$
   \frac{1}{dx^2} +  V_i
  $$
*  The **off-diagonals elements** are given by:
   $$
   -\frac{1}{2dx^2}
   $$

### Numerical Implementation

We compute the eigenvalues and eigenstates by solving this matrix equation. 
Below is a Python implementation using NumPy to construct the Hamiltonian matrix and compute the eigenvalues
and eigenvectors:

<worker-cell mode="python" workers-pool="pyPool">
import numpy as np
from numpy.typing import NDArray

FloatArray = NDArray[np.float64]
MatrixArray = NDArray[np.float64]
ComplexArray = NDArray[np.complex64]


def hamiltonian_matrix(e_pot: FloatArray) -> MatrixArray:
    dx = 1 / len(e_pot)
    d = 1 / dx**2 + e_pot[1:-1]
    e = -1 / (2 * dx**2) * np.ones(len(d) - 1)
    return np.diag(d) + np.diag(e, k=1) + np.diag(e, k=-1)


def compute_eigen(h_mat: MatrixArray):
    return np.linalg.eigh(h_mat)


def to_pdf(psi: ComplexArray) -> FloatArray:
    prob_density = np.abs(psi) ** 2
    total_probability = np.sum(prob_density)
    return prob_density / total_probability

</worker-cell>

*  The `hamiltonian_matrix` function constructs a tri-diagonal matrix representing the Hamiltonian.
*  The `compute_eigen` function uses NumPy’s `eigh` function to compute the eigenvalues and eigenvectors
   of the Hamiltonian.
*  The `to_pdf` function computes the Probability Density Function to find the particle at a given point \\(x\\) 
   for a given wave-function \\(\psi\\).

### Results

Let's start by defining a grid for the space dimension (\\(x\\)):
<js-cell>
const N = 200
const grid = Array.from({ length: N }, (_, i) => i / (N - 1))
</js-cell>

The next cell defines different potential energy profiles for the 1D Time Dependent Schrödinger Equation (TDSE).
The user can select between a harmonic potential, a single Gaussian well, or a double Gaussian well. 
These potentials are defined using simple mathematical expressions and can be used to study the behavior of 
quantum particles in different fields.


<js-cell>
const gaussianWell = ({ depth, mean, sigma }) => {
    return (x) =>
        depth * (1 - Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2))))
}

const scenariosEpot = {
    harmonic: (x) => 1e4 * (x - 0.5) ** 2,
    singleWell:  gaussianWell({ depth: 5e3, mean: 0.5, sigma: 0.15 }),
    doubleWell: (x) =>
        gaussianWell({ depth: 1e4, mean: 0.39, sigma: 0.1 })(x) +
        gaussianWell({ depth: 2e4, mean: 0.7, sigma: 0.1 })(x),
}
const dropDown = new Views.Select({items:scenariosEpot, selected:'harmonic'})
display(dropDown)
const epot = dropDown.value$.pipe(
    rxjs.map( epotFct => grid.map(epotFct) )
)
display(epot)
</js-cell>

The next cell reacts to the current scenario selection from the dropdown and triggers the computations of the 
eigenstates and eigenvalues:

<worker-cell mode="python" workers-pool="pyPool" captured-in="epot" captured-out="eigen_resp">

h_mat = hamiltonian_matrix(np.array(epot))
eigen_vals, eigen_states = compute_eigen(h_mat)
eigen_resp = {
    "epot":epot,
    "eigen_states": eigen_states.T,
    "eigen_vals": eigen_vals,
    "states": [
        { "energy": eigen_vals[i], "pdf": to_pdf(eigen_states.T[i]) }
        for i in range(0,len(eigen_vals))
    ]   
}
</worker-cell>

The `eigen_resp` variable is captured as output (it emits new value each time the selected scenario is updated), 
and used in the following cell to plot the results:

<js-cell>
const content = {
    tag: 'div',
    class: 'h-100 w-100 d-flex flex-column',
    children:[
        { tag:'div', class: 'mx-auto', children:[dropDown] },
        {
            source$: eigen_resp,
            vdomMap: (resp) => {
                return {
                    tag: 'div',
                    class: 'flex-grow-1 w-100',
                    connectedCallback: (element) => { 
                        const chart = initChart(element, grid, resp.epot, d3) 
                        const pdf0Max = d3.max(resp.states[0].pdf)
                        const deltaE0 = chart.yScale(resp.states[1].energy) - chart.yScale(resp.states[0].energy)
                        const pdfScale = d3.scaleLinear().domain([0, pdf0Max]).range([0, deltaE0])
                        resp.states.forEach((state) => {
                            if (state.energy < chart.Vmax) {
                                plot({ chart, state, update: false, pdfScale, coef: 1 })
                            }
                        })
                    }
                }
            }
        }
    ]
}

display(Views.Layouts.single({content}))
</js-cell>

## Time Evolution

Any initial wave function \\(\psi_0(x)\\) can be expressed as a linear combination of the Hamiltonian's eigenstates:
$$
|\psi_0> = \sum_{n=1}^N c_n^{(0)}|\phi_n>
$$
where \\(c_n^{(0)} = <\phi_n|\psi_0>\\) are the projection coefficients on the eigenstates \\(|\phi_n>\\).

Because the Schrödinger equation is a linear differential equation, meaning that if two state vectors
\\(|\psi_1>\\) and \\(|\psi_1>\\) are solutions, then so is any linear combination:
$$
|\psi> = a|\psi_1> + b|\psi_2>
$$
of the two state vectors where \\(a\\) and \\(b\\) are any complex numbers.
This property allows superpositions of quantum states to be solutions of the Schrödinger equation.
Even more generally, it holds that a general solution to the Schrödinger equation can be found by taking a weighted 
sum over a basis of states. A choice often employed is the basis of energy eigenstates, which are solutions of the 
time-independent Schrödinger equation. In this basis, a time-dependent state vector is given by:

$$
|\psi(t)> = \sum_{n=1}^N c_n^{(0)} e^{-iE_nt}|\phi_n>
$$

### Numerical Implementation

#### Initial Wave function

It is usual to use as initial wave function of localized particles a Gaussian wave packet:
Let's first define a function computing an initial wave function in the form of a Gaussian wave packet:

<worker-cell mode="python" workers-pool="pyPool">

def initial_wave_function(x: FloatArray, x0: float, sigma: float, p0: float) -> ComplexArray:
    psi0 = np.exp(-((x - x0) ** 2) / (2 * sigma**2)) * np.exp(1j * p0 * x)
    return psi0

</worker-cell>

**Gaussian envelope**

$$
exp\(-\frac{(x-x_0)^2}{2\sigma^2}\)
$$
This term ensures the wave packet is localized around \\(x_0\\) with a spread determined by \\(\sigma\\).

**Plane Wave Component**
$$
exp\(ip_0x\)
$$
Introduces a phase oscillation corresponding to momentum \\(p_0\\).

#### Projecting onto Eigenstates

The next function projects the initial wave function onto the eigenstates of the Hamiltonian to obtain the coefficients
\\(c_n^{(0)}\\) which quantify the contribution of each eigenstate to the initial state.

<worker-cell mode="python" workers-pool="pyPool">

def compute_projection_coefs(psi: ComplexArray, eigen_states: MatrixArray, basis_size: int):
    padded_eigenstates = np.pad(eigen_states[0:basis_size], [(0, 0), (1, 1)], mode="constant")
    c0 = np.dot(padded_eigenstates, psi_0)
    return c0, padded_eigenstates

</worker-cell>

**Padding Eigenstates**

The line `np.pad(eigen_states[0:basis_size], [(0, 0), (1, 1)], mode="constant")`
incorporates boundary conditions by padding the eigenstates with zeros at the boundaries:
it is assumed here that \\(\phi_0=\phi_N=0\\). 
Also, the `[0:basis_size]` restrict the space defined by the eigen states to the first `basis_size` 
elements. This is to speed-up computations, as in usual scenario only the lowest energetics eigenstates actually 
contribute to the system.

#### Time Evolution

The next function computes the time-evolved of the wavefunction \\(\psi(t)\\) 
and calculates the total energy of the system at a specific time \\(t\\).


<worker-cell mode="python" workers-pool="pyPool">

def time_evolution(
    psi: ComplexArray, 
    t: float, 
    eigen_values: FloatArray, 
    eigen_states: MatrixArray,
    basis_size: int
    ):
    c0, psi_js = compute_projection_coefs(psi, eigen_states, basis_size)
    psi_t = psi_js.T @ (
        c0 * np.exp(-1j * np.array(eigen_values)[0:basis_size] * t)
    )
    psi_t /= np.linalg.norm(psi_t)
    total_energy = 0
    for i in range(0, basis_size):
        coef_i = psi_t[1:-1].dot(eigen_states[i])
        total_energy += np.abs(coef_i) ** 2 * eigen_values[i]
    return to_pdf(psi_t), total_energy
</worker-cell>

**Time Evolution**

The time evloution is computed from the line:

`psi_js.T @ (cs0 * np.exp(-1j * np.array(eigen_values)[0:basis_size] * t))`.

It computes the phase factor \\(e^{-iE_nt}\\) defining the evolution of the initial coefficient \\(c_n^{(0)}\\).
The remaining is to reconstruct the wave function using:
$$
\psi(t) = \sum_{n=1}^N c_n^{(0)} e^{-iE_nt}\phi_n(x)
$$

**Normalization**

The line `psi_t /= np.linalg.norm(psi_t)` ensures the evolved wave function \\(\psi(t)\\) remains normalized.

**Total Energy**

The snippet
```
for i in range(0, basis_size):
    coef_i = psi_t[1:-1].dot(eigen_states[i])
    total_energy += np.abs(coef_i) ** 2 * eigen_values[i]
``` 
computes the expectation value of energy:

$$
\<E\> = \sum_{n=1}^N |c_n(t)|^2E_n
$$

Here again, a cut-off `basis_size` is used.

### Results

The next JavaScript cell orchestrates the time evolution's computation of the wave function based on the selected
potential and its precomputed eigenstates and eigenvalues. 
New inputs are emitted every `100ms`, including an attribute `t` that defines the expected evolution time.

<js-cell>
const inputs = eigen_resp.pipe(
    rxjs.switchMap( (resp) => {
        return rxjs.timer(0,100).pipe(
            rxjs.map((c) => {
                return {
                    epot: resp.epot,
                    eigen_states: resp.eigen_states,
                    eigen_values: resp.eigen_vals,
                    t: 0.0003 * c,
                    psi0: {
                        x0: 0.35,
                        sigma: 0.05,
                    },
                }
            }),
            rxjs.take(1000)
        )
    })
)
</js-cell>

The next cell listen to the observable `inputs` and proceed with the computation.

<worker-cell mode="python" workers-pool="pyPool" captured-in="inputs" captured-out="state_resp">
import time

t0 = time.time()
x = np.linspace(0, 1, len(inputs.epot))
psi_0 = initial_wave_function(x=x,x0=inputs.psi0.x0, sigma=inputs.psi0.sigma, p0=0)
pdf, energy = time_evolution(
    psi=psi_0,
    t=inputs.t, 
    eigen_values=inputs.eigen_values,
    eigen_states=inputs.eigen_states,
    basis_size=30
)

state_resp = {
    "pdf": pdf,
    "energy": energy
}
print("Computed in ", time.time() - t0)
</worker-cell>

The `state_resp` variable is finally captured as output (it emits new value each time the `inputs` variable is updated),
and used in the following cell to plot the results:


<js-cell>
const content2 = {
    tag: 'div',
    class: 'h-100 w-100 d-flex flex-column',
    children:[
        { tag:'div', class: 'mx-auto', children:[dropDown] },
        {
            source$: rxjs.combineLatest([eigen_resp,state_resp]),
            vdomMap: ([eigen_resp, state_resp]) => {
                return {
                    tag: 'div',
                    class: 'flex-grow-1 w-100',
                    connectedCallback: (element) => { 
                        const chart = initChart(element, grid, eigen_resp.epot, d3) 
                        const pdf0Max = d3.max(eigen_resp.states[0].pdf)
                        const deltaE0 = chart.yScale(eigen_resp.states[1].energy) - chart.yScale(eigen_resp.states[0].energy)
                        const pdfScale = d3.scaleLinear().domain([0, pdf0Max]).range([0, deltaE0])
                        eigen_resp.states.forEach((state) => {
                            if (state.energy < chart.Vmax) {
                                plot({ chart, state, update: false, pdfScale, coef: 1, d3 })
                            }
                        })
                        plot({ chart, state: state_resp, pdfScale, update: true, coef: 3, d3 })
                    }
                }
            }
        }
    ]
}

display(Views.Layouts.single({content:content2}))
</js-cell>

<js-cell cell-id="final-view">
display(Views.Layouts.single({content:content2}))
</js-cell>
