# Utilities

This page gathers utilities function imported from the [Quantum Chemistry page](@nav/quantum-chem).


## Controls panel

The controls panels are created using the
<a href='https://tweakpane.github.io/docs/' target='_blank'>tweakpane library</a>.

The next function is a small helper to factorize their creation.

<js-cell>
const createCtrlPanel = (data) => {
    sections = new Set(data.map(d => d.section))
    const pane = new TP.Pane()
    for(const section of sections){
        const folder = pane.addFolder({title: section})
        const params = data.filter( (parameter) => parameter.section === section)
        params.forEach((param) => {
            if(param.type==='button'){
                folder.addButton({title: param.name}).on('click', () => param.value$.next(true))
                return
            }
            folder.addBinding(
                { [param.name]: param.value$.value }, param.name, param.parameters
            ).on('change', (ev)=> param.value$.next(ev.value));
        })
    }
    return pane.element
}
</js-cell>

## 3D

3D visualization is managed by the library <a href="https://threejs.org/" target="_blank"> three.js</a>.
The following cell setups an empty 3D scene with appropriate lightnings and camera.
<js-cell>
const createEmptyThreeScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 50;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 
    directionalLight.position.set(1, 1, 1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); 
    directionalLight2.position.set(-1, -1, -1);
    scene.add(ambientLight, directionalLight, directionalLight2);
    return [scene, camera]
}
</js-cell>

The next function `create3DViewer` encapsulates renderer initialization, resize management and camera control
by providing a simple HTML view that can be included in the document. The element is formalized as a virtual DOM from 
the library `@youwol/rx-vom`.

<js-cell>
const create3DViewer = (scene, camera) => {
    function resizeCanvasToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }
    return {
        tag: 'div',
        class:'w-100 h-100',
        style:{
            aspectRatio: '1/1',
        },
        connectedCallback:(elem) => {
            const renderer = new THREE.WebGLRenderer();
            const rect = elem.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height);
            elem.appendChild(renderer.domElement);
            renderer.domElement.style.width = '100%'
            renderer.domElement.style.height = '100%'
            const controls = new TrackballControls(camera, renderer.domElement);
            function animate() {
                resizeCanvasToDisplaySize(renderer)
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        }
    }
}
</js-cell>

Helpers to create the 3D objects for: (i) atoms, and (ii) iso-surface.

<js-cell>
const createAtomsMesh = (positions, types) => {
    const display = {
        'C': [0x808080, 0.77], 'N': [0x0000ff, 0.75], 'O': [0xff0000, 0.73], 'H': [0xffffff, 0.37]
    }
    const group = new THREE.Group();
    positions.forEach((position, index) => {
        var options = display[types[index]];
        var atomMesh = new THREE.Mesh(
             new THREE.SphereGeometry(options[1], 32, 32), 
             new THREE.MeshPhongMaterial({ color: options[0], specular: 0x111111, shininess: 200, })
        );
        atomMesh.renderOrder = 0
        atomMesh.position.set(...position);
        group.add(atomMesh);
    });  
    group.userData.id = 'atoms'
    return group
}

const createIsoMesh = ([vertices, faces, normals], isoPercent, colorScale, opacity ) => {
    const colorsMaps = {
        'YlNavy': chroma.scale(['yellow', 'navy']).domain([100, 0]).mode('lab'),
        'Spectral': chroma.scale('Spectral').domain([100,0])
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3))
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(faces.flat()), 1))
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals.flat()), 3))
    let baseMat = {
        color: colorsMaps[colorScale](isoPercent).hex(), specular: 0x111111, shininess: 200,
        depthWrite: false, depthTest: true, side: THREE.DoubleSide
    }
    if(opacity!==1){
        Object.assign(baseMat, { transparent:true, opacity, depthWrite: false, depthTest: true})
    }
    const material = new THREE.MeshPhongMaterial(baseMat)                
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = "iso-surface"
    mesh.userData.id = 'iso-surface'
    mesh.renderOrder = isoPercent
    return mesh
}

const addMeshInScene = (scene, mesh) => {
    scene.children.forEach((obj) => {
        if (obj.userData && obj.userData.id === mesh.userData.id){
            scene.remove(obj)
        }
    })
    scene.add(mesh)
}
</js-cell>

The next function parse the molecule string inputs into two list: (i) the coordinates, and (ii) the atom's type.
<note level='warning'>
It is very picky regarding the input formatting, in particular no extra spaces are allowed.
This implementation needs to be robustify.
</note>

<js-cell>
const formatRawInput = (input) => {
    const types = input
        .split('\n')
        .map((line) => line.split(' ')[0]).slice(1)
    const coordinates = input
        .split('\n')
        .map((line) => line.split(' ').slice(1).reduce((acc,e) => [...acc, parseFloat(e)], [])).slice(1)    
    return [coordinates, types]
}
</js-cell>

## Backends

The next client is to facilitate the communication with the backend regarding the endpoint `/cube`.
It basically formats the body of the request from the data available.
<js-cell>
class PyScfClient_{

    constructor(backend){
        this.backend = backend
    }
    getCube(molecule, method, basis, resolution) {
        const methodsBody = {
            'rhf': { type: 'scf.rhf' },
            'dft-b3lyp': { type: 'dft.rks', params: { xc:'b3lyp' }},
        }
        const body = {
            mole:{ 
                atom:molecule, 
                basis
            }, 
            bbox: { nx: resolution, ny :resolution, nz: resolution, margin: 3}, 
            method: methodsBody[method]
        }
        return this.backend.fromFetch(
            '/cube', 
            { method: 'post', body: JSON.stringify(body), headers: { "Content-Type": "application/json"}}
        )
    }
}
const PyScfClient = PyScfClient_
</js-cell>


## Views

The `pendingMessageView` is a simple view to display messages regarding the computation in progress.
It is a virtual DOM from the `@youwol/rx-vdom` library.

<js-cell>
const pendingMessageView = (compute$, result$, iso$) => {
    const status$ = new rxjs.Subject()
    const sub1 = compute$.subscribe(() => status$.next('Computing...'))
    const sub2 = result$.subscribe(() => status$.next('Creating iso-surface...'))
    const sub3 = iso$.subscribe(() => status$.next(''))
    return {
        tag: 'div',
        class: 'mkdocs-text-info',
        innerText: { 
            source$: status$,
            vdomMap: (s) => s
        },
        style:{
            position:'absolute', 
            width:'fit-content', 
            left:'10px', 
            right: '10px'
        },
        connectedCallback: (elem) => { elem.ownSubscriptions(sub1, sub2, sub3) }
    }
}
</js-cell>

## python

<js-cell>
const {pyodide} = await webpm.install({
    pyodide:{
        version:'0.25.0',
        modules:["numpy", "scikit-image"]
    }
})
</js-cell>

The following cells are implemented in python, they concerned the computation of the iso-surface from the 
numpy (3D) array returned by the backend:
*  the function `py_prepare_data` recovers a properly shaped numpy array from the raw bytes response describing
the electronic density at each point in space.
*  the function `py_iso_surface` compute the iso-surface from the electronic density numpy array and a target iso value
   using `skimage`.

<py-cell>
import numpy as np
from skimage import measure

def py_prepare_data(array_buffer, cube_info):
    shape = cube_info['shape']
    r = np.asarray(array_buffer)
    return r.reshape(shape)

def py_iso_surface(prepared_data, target_percent, cube_info):
    cube_info = cube_info
    shape = np.array(cube_info['shape'])
    min_corner = np.array(cube_info['min'])
    max_corner = np.array(cube_info['max'])
    spacing = (max_corner - min_corner) / (shape - 1)
    level = 10**( -7 + 8*(target_percent/100))
    verts, faces, normals, values =  measure.marching_cubes(prepared_data, level=level, spacing=spacing)
    verts = verts + min_corner
    return verts.tolist(), faces.tolist(), normals.tolist()
</py-cell>
