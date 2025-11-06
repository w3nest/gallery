# Worksheet
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

## Scenario

We create a **dropdown widget** that lets the user select between two scenarios (`foo` and `bar`). 
Each scenario corresponds to a different branching pattern (list of axes).

<js-cell> 

let select = new Views.Select({
    items: {
        foo:[[2, 4, 1], [1, 0, 2, 0], [0, 0]], 
        bar:[[4, 3, 2, 1], [2, 2], [1]]
    },
    selected: 'foo',
    displayedNames: { 'foo': 'Foo', 'bar': 'Bar'}
})
display(select)
const scenario = select.value$
display(scenario)
</js-cell>

---

## Python Computations


Next, we load the main Python packages we’ll need:  
- `MTG` and `fat_mtg` for plant topology  
- `Weber_MTG` and `Quaking_Aspen` for tree parameterization

<interpreter-cell interpreter="openalea" language="py">
from openalea.mtg import MTG, fat_mtg
from openalea.weberpenn.mtg_client import Weber_MTG
from openalea.weberpenn.tree_client import Quaking_Aspen
</interpreter-cell>

We now define a **utility function** `default_mtg` that constructs a multiscale tree graph (MTG) based on a list of
branching axes. This is a reusable building block that will let us generate different tree shapes.


<interpreter-cell  interpreter="openalea" language="py">
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

## VS-Flow

Now we integrate the generated MTG into a **VS-Flow project**.  
First, install the core VS-Flow module:

<js-cell>
const { vsf } = await webpm.install({
    esm:[
        '@vs-flow/core#^0.4.0 as vsf'
    ],
    css: [`@vs-flow/flowchart-3d#^0.4.0~assets/style.css`,]
})
let project = new vsf.Projects.ProjectState()

</js-cell>

We define a **custom module** that exposes the MTG geometry (the reactive variable `geom`) as an output 
stream (`output$`). 
This lets the geometry flow through the VS-Flow pipeline.

<js-cell>
const module = new vsf.Modules.Module({
    declaration: {
        typeId: 'MTG',
        dependencies: {
            esm:['rxjs#^7.8.2 as rxjs']
        }
    },
    implementation: ({fwdParams}) => {
        const rxjs = fwdParams.dependencies.rxjs
        return new vsf.Modules.Implementation(
            {
                outputs: () => ({
                    output$: geom.pipe(
                        rxjs.map((geom) => ({data:geom}) )
                    )
                })
            },
            fwdParams
        )
    }
})
</js-cell>

Next, we assemble the **workflow graph** in VS-Flow.  
The pipeline connects:  
- our `mtg` module  
- a Three.js `bufferGeometry` node  
- a Three.js `viewer` node

<js-cell>
project = await project.with({
    toolboxes: {
        '🔀':'@vs-flow/tb-rxjs#^0.4.0',
        '💎':'@vs-flow/tb-three-js#^0.4.0',
    },
    customModules:[module],
    workflow:{
        branches: [
            'mtg >> bufferGeom >> viewer',
        ],
        modules: {
            mtg:'CustomModules.MTG',
            bufferGeom: '💎.bufferGeometry',
            viewer: '💎.viewer',
        }
    },
})
display(project)
</js-cell>
  

Finally, we put it all together in a **layout** where the viewer and the dropdown select widget are displayed in 
the same view.


<js-cell>

const topRight = {
    tag: 'div',
    class: 'bg-light p-2 border rounded',
    children: [
        select
    ]
}
const superposedLayout = Views.Layouts.superposed({
    content: project.getHtml('viewer'),
    topRight
})
display(superposedLayout)
</js-cell>
  