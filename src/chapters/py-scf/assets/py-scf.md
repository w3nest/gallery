# Quantum chemistry

## Introduction

<cell-output cell-id='final' full-screen='true'>
</cell-output> 

<note level="warning">
This page relies on a large number of dependencies, it can take a bit of time to load (especially the first time).
The final view will be displayed above once the page has been executed.
</note>

On this page, we offer the computation and visualization of electronic density for water and caffeine molecules.
The process employs *ab-initio* computation, *i.e.* the computations of electronic orbitals with no other hypotheses than 
Coulomb interactions between all electrons and nuclei with electrons obeying Fermi statistics with the 
Pauli exclusion principle.

The following cell trigger the installation of the required components:
*  <a href="https://threejs.org/" target="_blank"> three </a> for 3D rendering.
*  <a href="https://tweakpane.github.io/docs/" target="_blank"> tweakpane </a> for creating controls panels.
*  <a href="https://rxjs.dev/" target="_blank"> rxjs </a> for managing reactive streams of data.
*  <a href="https://github.com/youwol/rx-vdom#README.md" target="_blank"> rx-vdom </a> for creating
reactive HTML views.
*  <a href="https://gka.github.io/chroma.js/" target="_blank"> chroma-js </a> for generating color scales.
*  <a href="https://github.com/youwol/pyscf_backend_project" target="_blank"> pyscf_backend </a> is the backend
responsible for handling the *ab-initio* computations; built upon the
<a href="https://pyscf.org/" target="_blank"> PySCF</a> Python package.
*  <a href="https://numpy.org/" target="_blank" >numpy</a> and 
   <a href="https://scikit-image.org/" target="_blank" >scikit-image</a> Python libraries for computing
   iso-surfaces from the *ab-initio* outputs. These libraries run within your browser thanks to 
   <a href="https://pyodide.org/en/stable/index.html" target="_blank" >pyodide</a>.

<js-cell>
const {rxDom, backend, pyodide, TP, THREE, rxjs} = await webpm.install({
    esm:[
        '@youwol/rx-vdom as rxDom',
        'three#0.128.0 as THREE',
        'three-trackballcontrols#0.0.8 as TrackballControls',
        'rxjs#7.5.6 as rxjs',
        'tweakpane#^4.0.1 as TP',
        'chroma-js#^2.4.2 as chroma'
    ],
    backends:['pyscf_backend#^0.1.0 as backend'],
    pyodide:{
        version:'0.25.0',
        modules:["numpy", "scikit-image"]
    },
    onEvent: (ev) => display(ev.text)
})
pyodide.setDebug(true)
const {
    createCtrlPanel,
    createEmptyThreeScene, 
    create3DViewer,
    createAtomsMesh,
    createIsoMesh,
    addMeshInScene,
    formatRawInput,
    PyScfClient, 
    py_prepare_data,
    py_iso_surface,
    pendingMessageView } = await load("/sciences/quantum-chem/utils")
</js-cell>

## Theory

The Hamiltonian operator for a molecule in quantum mechanics includes several contributions, such as kinetic 
energy of nuclei and electrons, electron-electron repulsion, electron-nucleus attraction, and possibly external 
potential energies. Here's the general form of the Hamiltonian operator for an isolated molecule without relativistic
effects:

$$
 \hat{H} = -\hat{T_e} -\hat{T_I} - \hat{U_{ee}} + \hat{U_{eI}} + \hat{U_{II}}
$$
Where:
*  \\( \hat{T_e}=\frac{\hbar^2}{2m_e} \sum_{i=1}^{N_e} \nabla_i^2 \\) is the electrons kinetic energy. 
*  \\( \hat{T_I}=\frac{\hbar^2}{2M} \sum_{I=1}^{N_I} \nabla_I^2  \\) is the nuclei kinetic energy.
*  \\( \hat{U_{ee}} = \sum_{i=1}^{N_e} \sum_{I=1}^{N_I} \frac{Z_I e^2}{| r_i - R_I |} \\) is the electrons-nuclei interaction energy.
*  \\(\hat{U_{eI}} = \frac{1}{2} \sum_{i=1}^{N_e} \sum_{j \neq i}^{N_e} \frac{e^2}{| r_i - r_j |} \\) is the electrons-electrons 
interaction energy.
*  \\(\hat{U_{II}} =\frac{1}{2} \sum_{I=1}^{N_I} \sum_{J \neq J}^{N_I}\frac{Z_I Z_J}{| R_I - R_J |} \\) is the nuclei-nuclei
    interaction energy.


The purpose of quantum chemical computation illustrated here is to determine the stationary \\(|\psi_n>\\) solutions of
the equation:
$$
\hat{H}|\psi_n> = E_n |\psi_n>
$$

When considering the nuclei fixed (a good approximation in any case: given the mass difference between nuclei and 
electrons it is possible to consider that the latter adapt 'instantaneously' to nuclei positions), the Hamiltonian
reduce to:
$$
\hat{H} = -\hat{T_e} - \hat{U_{ee}} + \hat{U_{eI}} + \hat{U_{II}}
$$

*Ab-initio* computations purpose is to compute the eigenvalues of this operator using Self Consistency Field.

### Self Consistency Field

A self-consistent field (SCF) refers to a computational method where the 
electron density is determined in an iterative manner until a consistent solution is reached. 
This concept is central to many electronic structure methods, including the Hartree-Fock (**HF**) method and 
density functional theory (**DFT**), those two kin of methods are exposed in the present application.

Here's what the term "self-consistent field" means in more detail:

1. **Field**: In quantum mechanics, a "field" typically refers to a mathematical function that describes the 
distribution of a physical quantity in space. In the context of electronic structure calculations, 
the "field" often refers to the electron density or the molecular orbital wave function.

2. **Self-Consistent**: The term "self-consistent" indicates that the field being solved for is consistent with itself. 
In other words, the solution for the field must satisfy a set of equations where the field depends on itself. 
This usually involves solving an equation where the field is both an input and an output.

3. **Iteration**: Achieving self-consistency often requires an iterative approach. The initial guess for the field 
is used to calculate a new field, which is then used as the input for the next iteration. 
This process continues until the calculated field converges to a consistent solution, meaning that further iterations
do not significantly change the result.

Density Functional Theory (DFT) and Hartree-Fock (HF) methods neglect electron correlation because they assume that 
electron interactions can be effectively described by a mean field, leading to a simplified and computationally 
tractable self-consistent field approach.
A primary challenge is to go beyond and accurately describing electron correlation, DFT and HF differs in this matter:

1. **Hartree-Fock Method (HF)**:
    - In HF theory, electrons are assumed to move independently in the average field generated by all other electrons.
   This approach neglects electron correlation effects, such as electron-electron repulsion and exchange interactions.
    - The HF method provides a good starting point for electronic structure calculations but often underestimates 
   the correlation energy. Moller Plesset like methods (perturbation theory) allows to go beyond and recover exchange
   and correlation energy.

2. **Density Functional Theory (DFT)**:
    - DFT aims to address the shortcomings of HF theory by treating electron density rather than wave functions 
   directly. However, most DFT implementations use approximations for the exchange-correlation functional, 
   which represents the effects of electron correlation.
    - The accuracy of DFT calculations depends heavily on the choice of exchange-correlation functional.
   Some functionals perform well for certain types of systems or properties but may fail for others.

Improving the treatment of electron correlation remains an active area of research in quantum chemistry.

### Electronic basis set

In quantum chemistry, a basis set is a set of functions used to represent the wave functions of electrons in molecules. 
These functions are typically atomic orbitals centered on the atomic nuclei of the molecules. 
The choice of basis set is crucial in electronic structure calculations, as it affects the accuracy and efficiency
of the calculations.

Here's a short summary of the basis sets used in quantum chemistry:

1. **Atomic Orbitals**: The most common type of basis set consists of atomic orbitals, which are solutions to the 
Schrödinger equation for a single electron in the field of an atomic nucleus. These orbitals are typically represented 
as Gaussian functions or Slater-type orbitals.

2. **Basis Functions**: In electronic structure calculations, the wave function of a molecule is expanded as a 
linear combination of basis functions. Each basis function represents an atomic orbital centered on a specific atom 
in the molecule. The coefficients of the linear combination are determined during the calculation to minimize the 
total energy of the system.

3. **Basis Set Quality**: The choice of basis set affects the accuracy of electronic structure calculations. 
Larger basis sets with more basis functions provide better accuracy but require more computational resources. 
Basis sets are typically categorized into families such as minimal, double, triple, and quadruple-zeta, 
indicating the level of completeness and accuracy. It is also possible to use auxiliary basis sets
to represent electron correlation effects, such as polarization and diffuse functions.
These functions capture the effects of electron-electron interactions beyond the Hartree-Fock approximation

Here computations are proposed using the basis set **STO-3G**, **6-31G*** and **6-311+G(2d,p)**.
**STO-3G** employs Slater-type orbitals with three Gaussians per orbital, offering simplicity and speed. 
**6-31G*** provides six Gaussian functions per orbital, including polarization and diffuse functions, 
suitable for general-purpose organic molecule calculations. 
**6-311+G(2d,p)** extends **6-31G*** with additional polarization and diffuse functions, enhancing accuracy 
for larger or heavy-atom-containing molecules.

## Implementation

The remaining document aims to develop the application showcased at the top of this page. This process includes:
*  Specifying the atoms present in the molecules, especially their spatial arrangements.
*  Sending requests to the backend to compute the electronic density.
*  Deriving the isosurfaces from the computed electronic density.
*  Offering reactive components to manipulate control parameters interactively.

### Atoms visualization

Let's first define the position and type of atoms for the water and caffeine molecules (Angstrom unit):

<js-cell>
const atoms = {
    Water: `
O 0.00 0.00 0.50\nH 0.761561 0.478993 0.50000000\nH -0.761561 0.478993 0.50`,
    Caffeine: `
C -0.0171 1.4073 0.0098\nC 0.0021 -0.0041 0.0020\nC 1.1868 2.1007 0.0020\nN -1.0133 2.3630 0.0190
N 2.3717 1.3829 -0.0136\nN 0.8932 3.4034 0.0118\nN 1.1884 -0.6467 -0.0128\nO -1.0401 -0.6344 0.0090
C 2.3458 0.0368 -0.0214\nC 3.6549 2.0897 -0.0220\nC 1.2155 -2.1115 -0.0209\nO 3.3959 -0.5761 -0.0355
C -0.4053 3.5654 0.0231\nC -2.4574 2.1166 0.0226\nH 3.9831 2.2592 1.0035\nH 4.3975 1.4884 -0.5465
H 3.5388 3.0475 -0.5293\nH 1.2124 -2.4692 -1.0505\nH 2.1169 -2.4610 0.4825\nH 0.3373 -2.4940 0.4993
H -0.9129 4.5186 0.0303\nH -2.8119 2.0494 1.0512\nH -2.9671 2.9358 -0.4846\nH -2.6677 1.1812 -0.4960`
}

</js-cell>

The application requires to react upon the molecule selection.
The next cell defines a reactive parameter `molecule$` that emits the selection each time it is changed,
and bind it to a control panel:

<js-cell>
const molecule$ = new rxjs.BehaviorSubject('Water')
let params = [
    {   name: 'molecule', 
        section: 'Computations', 
        value$: molecule$, 
        parameters:{ options: { Water: 'Water', Caffeine: 'Caffeine' } }
    }
]
display(createCtrlPanel(params))
display(molecule$)
</js-cell>

Now that molecule selection is accounted for, it is possible to visualize the atomic structures
using the <a href="https://threejs.org/" target="_blank">three.js library</a>.
The functions `createEmptyThreeScene` and `create3DViewer` in the following cell are exported from the
[Utilities page](@nav/quantum-chem/utils) to keep the code lighter here.

The cell defines a simple HTML container featuring a single 3D viewer child.
The `connectedCallback` purpose is to register subscribed actions when the view is
included within the page as well as to properly unregister them when removed (such as when the cell is re-run).


<js-cell>
const [scene, camera] = createEmptyThreeScene()
display({
    tag: 'div',
    class: 'w-100 h-100',
    children:[
        create3DViewer(scene, camera)
    ],
    connectedCallback: (elem) => {
        const sub = molecule$.subscribe((molecule) => {
            const [coordinates, elements] = formatRawInput(atoms[molecule])
            const atomsMesh = createAtomsMesh(coordinates,  elements)
            addMeshInScene(scene, atomsMesh)
        })
        elem.ownSubscriptions(sub)
    }
})
</js-cell>

### Computations

Let's move on binding electronic structure computations from the selected geometry.
The next cell describes the parameters of the computation that can be controlled, similarly to what has been 
done with the `molecule$` parameter:

<js-cell>
const resolution$ = new rxjs.BehaviorSubject(80)
const method$ = new rxjs.BehaviorSubject('rhf')
const basis$ = new rxjs.BehaviorSubject('6-31G*')
const compute$ = new rxjs.BehaviorSubject(true)
params = params.concat([
    {   name: 'method',
        section: 'Computations',
        value$: method$,
        parameters:{ options: { "rhf": "rhf", "dft-b3lyp": "dft-b3lyp"}}
    },
    {   name: 'basis',
        section: 'Computations',
        value$: basis$,
        parameters: { options: { "STO-3G": "STO-3G", "6-31G*": "6-31G*", "6-311+G(2d,p)": "6-311+G(2d,p)" }}
    },
    {   name: 'resolution',
        section: 'Computations',
        value$: resolution$,
        parameters: {min: 50, max: 200, step: 5}
    },
    {   name: 'compute',
        section: 'Computations',
        value$: compute$,
        type: 'button'
    }
])

display(createCtrlPanel(params))
</js-cell>

The parameters exposed are:
*  `method`: to select either **HF** or **DFT** method.
*  `basis`: to select the basis set.
*  `resolution`: to select the resolution over the electronic density computation in the 3D space.

A **compute** button is added, computations should be triggered only when clicked, 
as implemented in the following cell.

A `trigger$` reactive variable is expressed from the individual reactive parameter's: it emits the latest values of
`molecule$`, `method$`, `basis$`, `resolution$` when the **compute** button is clicked. Because all reactive parameters
(including `compute$`) have a default value, `trigger$` also emit directly.

<js-cell>
const trigger$ = compute$.pipe(
    rxjs.withLatestFrom(molecule$, method$, basis$, resolution$),
    rxjs.map( ([_, molecule, method, basis, resolution]) => [molecule, method, basis, resolution])
)
display(new Views.Text('**Molecule:**'), trigger$.pipe(rxjs.map( p => p[0])))
display(new Views.Text('**Method:**'), trigger$.pipe(rxjs.map( p => p[1])))
display(new Views.Text('**Basis:**'), trigger$.pipe(rxjs.map( p => p[2])))
display(new Views.Text('**Resolution:**'), trigger$.pipe(rxjs.map( p => p[3])))
</js-cell>

Let's now plug the backend computation over `trigger$`:

<js-cell>
const scfClient = new PyScfClient(backend)
const result$ = trigger$.pipe(
    // Trigger the HTTP request
    rxjs.switchMap(([molecule, method, basis, resolution]) => {
        return scfClient.getCube(atoms[molecule], method, basis, resolution )
    }),
    // cube.arrayBuffer() is a promise, converted to an observable using rxjs.from
    rxjs.switchMap( (cube) => rxjs.from(cube.arrayBuffer()).pipe(
        // Simple data formatting
        rxjs.map((buffer) => {
            const meta = JSON.parse(cube.headers.get('X-Content-Metadata'))
            return {
            moleInfo: meta.mole,
            cubeInfo: meta.cube,
            cubeBuffer:new Float64Array(buffer),
        }})
    )),
    rxjs.shareReplay({bufferSize:1, refCount: true})
)
// The following display extract only the moleInfo and cubeInfo from result$
display(result$.pipe(rxjs.map(({moleInfo, cubeInfo}) => ({moleInfo, cubeInfo}))))
</js-cell>

The `scfClient` (defined in the [Utilities page](@nav/quantum-chem/utils)) is a simple wrapper over
the javascript `fetch` function that properly format the body of the `POST` request.

### Iso surfaces

Let's conclude this tour by integrating the computation and visualization of the isosurfaces, 
which are influenced by the following reactive parameters:
- `result$`: It emits the electronic density as a 3D array at a defined resolution, along with metadata regarding the
molecule and visualization box.
- Visualization-specific parameters:
   - `isoPercent`: Determines the iso value to visualize as a percentage.
   - `colorScale`: Specifies the color scale to utilize, with options including the 'Spectral' and 'Navy' scales 
   from the <a href="https://gka.github.io/chroma.js/" target="_blank">chroma.js</a> library.
   - `opacity`: Enables control over the opacity of the iso-surface.
  
The next cell defines the visualization-specific parameters:

<js-cell>
const isoPercent$ = new rxjs.BehaviorSubject(50)
const colorScale$ = new rxjs.BehaviorSubject('YlNavy')
const opacity$ = new rxjs.BehaviorSubject(0.85)
params = params.concat([
    {   name: 'isoPercent',
        section: 'Iso-surface',
        value$: isoPercent$,
        parameters:{min: 0, max: 100, step: 1}
    },
    {   name: 'colorScale',
        section: 'Iso-surface',
        value$: colorScale$,
        parameters: { options: { YlNavy: 'YlNavy', Spectral: 'Spectral' }}
    },
    {   name: 'opacity',
        section: 'Iso-surface',
        value$: opacity$,
        parameters: {min: 0, max: 1, step: 0.1}
    }
])

display(createCtrlPanel(params))
</js-cell>

Before wrapping up, let's introduce two reactive variables:
* `isoData$`: Derived from `result$` and `isoPercent$`, it utilizes the Python library `scikit-image` to extract
the iso-surface definition using the <a href="https://en.wikipedia.org/wiki/Marching_cubes" target="_blank">
Marching Cube algorithm</a>. This component remains independent of visualization parameters.
* `isoMesh$`: Represents the 3D object suitable for inclusion in the 3D scene, 
relying on `isoData$` and the visualization parameters.

We let the reader refers to the implementation details of `py_prepare_data` & `createIsoMesh` in the
[Utilities page](@nav/quantum-chem/utils) if need be.


<js-cell>
const isoData$ = rxjs.combineLatest([result$, isoPercent$]).pipe(
    rxjs.debounceTime(500),
    rxjs.map(([result, isoPercent])=> {
        const prepared_data = py_prepare_data(result.cubeBuffer, result.cubeInfo)
        return {value: isoPercent, definition: py_iso_surface(prepared_data, isoPercent, result.cubeInfo).toJs()}
    })
)
const isoMesh$ = rxjs.combineLatest([isoData$, colorScale$, opacity$]).pipe(
    rxjs.map(([{value, definition}, colorScale, opacity])=> {
        return createIsoMesh(definition, value, colorScale, opacity)
    })
)
</js-cell>

Finally, here is the cell that defines the application included at the top of the page.
It is a simple view that gathers:
*  A message when computations are pending (exported from the [Utilities page](@nav/quantum-chem/utils)).
*  The controls panel.
*  The 3D viewer.
*  Scene updates are registered within the `connectedCallback`.

<js-cell cell-id="final">
const [sceneFinal, cameraFinal] = createEmptyThreeScene()
display({
    tag: 'div',
    class: 'w-100 h-100',
    style:{ position: 'relative'},
    children:[
        pendingMessageView(compute$, result$, isoMesh$),
        {
            tag: 'div',
            style:{
                position:'absolute', 
                width:'fit-content', 
                top:'10px', 
                right: '10px'
            },
            children:[
                createCtrlPanel(params)
            ]
        },
        create3DViewer(sceneFinal, cameraFinal)
    ],
    connectedCallback: (elem) => {
        const sub = rxjs.combineLatest([isoMesh$, result$]).subscribe(([isoMesh, result]) => {
            const atoms = createAtomsMesh(result.moleInfo.coordinates,  result.moleInfo.elements)
            addMeshInScene(sceneFinal, atoms)
            addMeshInScene(sceneFinal, isoMesh)
        })
        elem.ownSubscriptions(sub) 
    }
})

</js-cell>
