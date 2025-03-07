# 🔄 **Simple 3D Remeshing**

This page demonstrates the construction of a **remeshing application** using the power of **Three.js** for 3D rendering and **PMP (Polygon Mesh Processing)** for mesh operations.

## Tools & Libraries Used:

* **<ext-link target="three">Three.js</ext-link>**: A popular JavaScript library for 3D rendering in the browser.
* **<ext-link target="pmp">Polygon Mesh Processing Library</ext-link>**: A modern C++ open-source library for polygon 
surface meshes, ported to WebAssembly for browser compatibility.

---

## 🛠️ **Required Libraries**

To build and run the remeshing app, you'll need the following:

* **`@youwol/vsf-core`**: The core layer of the low-code engine **Visual Studio Flow**.
* **`@youwol/vsf-canvas`**: A library for rendering 3D flow-charts in the browser.

Here’s how you can install the necessary modules:

<js-cell>
const ViewsMdle = await webpm.installViewsModule()  

const {VSF} = await ViewsMdle.installWithUI({
    esm:{ 
        modules:[
            '@youwol/vsf-core#^0.3.3 as VSF', 
            '@youwol/vsf-canvas#^0.3.1 as Canvas'
        ],
    },
    display: (view) => display(view)
})
</js-cell>

---

## 🔄 **The Remeshing Flow**

The goal is to remesh a **torus geometry**. We’ll break down the flow of the remeshing process using three key toolboxes:

1. **`@youwol/vsf-three`**: Exposes <ext-link target="three">Three.js</ext-link> elements for working with 3D geometries.
2. **`@youwol/vsf-pmp`**: Exposes <ext-link target="pmp">PMP</ext-link> remeshing algorithms.
3. **`@youwol/vsf-rxjs`**: Provides <ext-link target="rxjs">rxjs</ext-link> data-flow operators.

Here’s the flow definition that creates, processes, and displays the remeshed geometry:

<js-cell>
let project = new VSF.Projects.ProjectState()

const flow = 
// Load a geometry
"(of#of)>>(torusKnot#geom)" + 
// Re-mesh it
">>(fromThree#convIn)>>(uniformRemeshing#remesh)>>(toThree#convOut)" +
// Display the remeshed geometry
">>(viewer#viewer)"

project = await project.with({
    toolboxes:["@youwol/vsf-three", '@youwol/vsf-pmp', '@youwol/vsf-rxjs'],
    workflow: {
        branches:[flow],
        configurations:{
            // Adjust edge factor between 0.1 - 1
            remesh: { edgeFactor: 0.7 }
        }
    }
})
</js-cell>

**Flow Explanation**

This flow is a simple sequential process where each module performs a specific task:

1. **`of`**: Initiates the process by emitting a trigger.
2. **`geom`**: Generates the torus knot using default parameters.
3. **`convIn`**: Converts the **Three.js** data structure to a format suitable for **PMP** processing.
4. **`remesh`**: Applies **uniform remeshing** with an `edgeFactor` of `0.7`, overriding the default value.
5. **`convOut`**: Converts the remeshed geometry back into a format usable by **Three.js**.
6. **`viewer`**: Displays the final remeshed geometry.

---

## 🎨 **Render the Flow-Chart**

Below is the flow-chart of the project rendered using the `Canvas` class of **`@youwol/vsf-canvas`**:

<js-cell>
display({ 
    tag: 'div', 
    class: 'w-100',
    style: { height: '500px' }, 
    children: [
        new Canvas.Renderer3DView({
            project$: rxjs.of(project), 
            workflowId: 'main'
        })
    ]
})
</js-cell>

---

## 🔍 **Inspecting the Viewer Module**


In the project, the viewer module is connected to an HTML element generator to display the resulting scene. 
To display it:

<js-cell>
const viewerModule = project.instancePool.inspector().getModule('viewer')
display(
    Views.Layouts.viewPortOnly({
        content: viewerModule.html()
    })
)
</js-cell>


<note level="hint" title="`viewPortOnly`?">
The `viewPortOnly` function ensures that the 3D view is **automatically hidden** when it goes out of the viewport
(during scrolling), and **re-shown** when it comes back into the view. 
This feature helps optimize performance and ensures that your view is always visible when needed.
</note>