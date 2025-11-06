# 📓 Worksheet
---

This page showcases a short example to create a multiscale tree graph (MTG).

It runs using a backend python interpreter featuring a dedicated Openalea environment:

<js-cell>
const openalea = await installInterpreter({
    backend: 'pyrun_backend#^0.2.2',
    dockerfile: `${BASE_URL}/assets/openalea.Dockerfile`,
    buildWith: { mambaModules:'oawidgets openalea.weberpenn' },
    display,
    notification: true
})
display(openalea)
</js-cell>

---

## 🎛️ Scenario

We create a **dropdown widget** that lets the user select between two scenarios (`foo` and `bar`). 
Each scenario corresponds to a different branching pattern (list of axes).

<js-cell> 
let select = new Views.Select({
    items: {
        foo:[[2, 4, 1], [1, 0, 2, 0], [0, 0]], 
        bar:[[4, 3, 2, 1], [2, 2], [1]]
    },
    selected: 'foo',
    displayedNames: { 'foo': '2-4-1', 'bar': '4-3-2-1'}
})
display(select)
const scenario = select.value$
display(scenario)
</js-cell>

---

## ⚙️ Python Computations

We now define a **utility function** `default_mtg` that constructs a multiscale tree graph (MTG) based on a list of
branching axes. This is a reusable building block that will let us generate different tree shapes.

<interpreter-cell  interpreter="openalea" language="py">
from openalea.mtg import MTG, fat_mtg

def default_mtg(axes):
    g = MTG()
    root = g.add_component(g.root)

    def add_axis(vid, axis):
        stack = []
        for nb_ramif in axis:
            # Add ramification children
            for _ in range(nb_ramif):
                v = g.add_child(vid, edge_type="+")
                stack.append(v)
            # Add main axis continuation
            vid = g.add_child(vid, edge_type="<")
        return stack

    # Start with the root
    current_vertices = [root]

    # Iteratively apply each axis
    for axis in axes:
        next_vertices = []
        for vid in current_vertices:
            next_vertices.extend(add_axis(vid, axis))
        current_vertices = next_vertices

    fat_mtg(g)
    return g
</interpreter-cell>


The next cell is reactive w/ `scenario`; when a scenario is chosen it:  
1. Builds the MTG with `default_mtg`  
2. Applies the **Weber–Penn tree generator** (`Weber_MTG`) with a `Quaking_Aspen` parameter set  
3. Runs the growth simulation  
4. Exports the geometry as raw vertices and indices, suitable for visualization.

The captured output variable `geom` is also reactive as the cell.

<interpreter-cell  interpreter="openalea" language="py" captured-in="scenario" captured-out="geom">
from openalea.weberpenn.mtg_client import Weber_MTG
from openalea.weberpenn.tree_client import Quaking_Aspen
from oawidgets.plantgl import group_meshes_by_color

g = default_mtg(scenario)
param = Quaking_Aspen()
wp = Weber_MTG(param, g)
wp.run()

plot = wp.plot()
meshes = group_meshes_by_color(plot, side="front")
geom = {
    "position": [float(v) for sublist in meshes[0].vertices for v in sublist],
    "index": [int(i) for sublist in meshes[0].indices for i in sublist]
}
</interpreter-cell>

---

## 🌳 3D rendering

The 3D visualization is powered by the <ext-link target="openalea.three">Three.js</ext-link> library.
Let’s begin by installing it and defining a `material` object controlling the rendering aspect.

<js-cell>
const { THREE, TrackballControls } =  await webpm.install({
    esm:[
        "three#^0.152.0 as THREE",
        "three-trackballcontrols#^0.0.8 as TrackballControls",
    ]
})
const material = new THREE.MeshStandardMaterial({
    color: 0x6699ff,
    metalness: 0.3,
    roughness: 0.6,
    side: THREE.DoubleSide
})
</js-cell>

The variable `geom`, computed in the previous Python cell, represents a geometry that we need to convert into a
<ext-link target="openalea.three.mesh">Mesh</ext-link> object to be rendered in Three.js.
The following (reactive) JavaScript cell implements this conversion:

<js-cell reactive="true">
const geometry = new THREE.BufferGeometry()
geometry.setIndex(
    new THREE.BufferAttribute(new Uint32Array(geom.index), 1)
)
geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(geom.position), 3)
)
geometry.computeVertexNormals()

const mesh$ = new THREE.Mesh(geometry, material)
</js-cell>

Here, `mesh$` is a reactive variable: when `geom` updates, the corresponding Three.js mesh is recreated automatically.

The following expandable section provides a set of **utility functions** for 3D rendering:
*  `createViewer` : Initializes the WebGL renderer, scene, camera, lights, and interactive controls.
*  `fitSceneToContent`: Adjusts the camera to fit the current scene content.
*  `dispose`: Properly removes and frees the memory of a mesh.

<note level="example" title="Rendering Utilities" icon="fas fa-code" expandable="true" >

<js-cell>
function createViewer(container) {
    
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x202025)
    const ratio = container.clientWidth / container.clientHeight
    const camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 1000)
    camera.position.set(0,0,10)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(ambientLight, dirLight)

    const controls = new TrackballControls(camera, renderer.domElement)
    controls.rotateSpeed = 4.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
    
    function animate() {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }
    animate()
    return { scene, camera, controls }
}


function fitSceneToContent(scene, camera, controls) {

    const bbox = scene.children.reduce((acc,e) => {acc.expandByObject(e); return acc} , new THREE.Box3())
    const size = bbox.getSize(new THREE.Vector3())
    const center = bbox.getCenter(new THREE.Vector3())

    const fitRatio = 1.2
    const pcamera = camera

    const maxSize = Math.max(size.x, size.y, size.z)
    const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * pcamera.fov) / 360))
    const fitWidthDistance = fitHeightDistance / pcamera.aspect
    const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance)

    const direction = controls.target
        .clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance)

    controls.maxDistance = distance * 10
    controls.target.copy(center)
    pcamera.near = distance / 100
    pcamera.far = distance * 100
    pcamera.updateProjectionMatrix()
    camera.position.copy(controls.target).sub(direction)
}

function dispose(scene, mesh){
    if(!mesh){
        return
    }
    scene.remove(mesh)
    mesh.geometry.dispose()
    mesh.material.dispose()
}
</js-cell>

</note>

Finally, we can create and display the viewer.
The viewer subscribes to the reactive variable `mesh$`, automatically updating the scene whenever a new mesh is 
generated.

<js-cell>
const layout = Views.Layouts.superposed({
    content: {
        tag:'div',
        class:'h-100 w-100',
        connectedCallback: (elem) => {
            const { scene, camera, controls } = createViewer(elem)
            let prevMesh
            mesh$.subscribe( (mesh) => {
                dispose(scene, prevMesh)
                scene.add(mesh)
                fitSceneToContent(scene, camera, controls)
                prevMesh = mesh
            })
        }
    },
    topRight: select
})
display(layout)
</js-cell>
