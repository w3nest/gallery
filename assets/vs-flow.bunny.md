# Bunny

## Objectives

The following sections outline the creation of a multi-threaded remeshing application.


<cell-output cell-id="final-view" full-screen="true" style="width:100%;height:500px">
<note level="warning" label="loading">
<i class="fas fa-spinner fa-spin"></i>

The final view will be displayed here once the page is fully executed. The execution time is not directly related to
the low-code application itself.

This document includes additional computations and rendering for educational purposes.

The view that will appear shortly is the output of the last cell on this page.

</note>
</cell-output>


In summary:
*  A file explorer, connected to the YouWol filesystem, enables users to select a
   file corresponding to a 3D object model.
*  Upon file selection, two key actions occur:
   (i) the display of a 3D scene featuring the chosen object and
   (ii) the initiation of a re-meshing computation, with the results presented in another 3D scene.
*  A control interface permits users to adjust parameters for the re-meshing computation.
*  These computations are executed using the PMP library,
   implemented in **C++** and run in the user's browser via Web Assembly.
   These computations are delegated to **separate threads** to ensure that the
   application remains responsive and unblocked.


## Dependencies

Let's first install the low code engine:

<js-cell>
const {VSF, Canvas } = await webpm.install({
    esm:['@youwol/vsf-core#^0.3.1 as VSF']
})
let project = new VSF.Projects.ProjectState()
</js-cell>

The following toolboxes are used:

<js-cell>
project = await project.with({
    toolboxes:[
        '@youwol/vsf-rxjs',     // Flows management
        '@youwol/vsf-files',    // Files picking & reading
        '@youwol/vsf-three',    // 3D vizualisation
        '@youwol/vsf-sci-three',// GoCad models loader
        '@youwol/vsf-rx-vdom',  // Reactive views
        '@youwol/vsf-pmp'       // Remeshing
    ]
})
</js-cell>

To improve clarity, a few symbols have been factored into subpages. These symbols will be introduced and used later 
in this document:

<js-cell>
const { 
    macroTo3dObject, 
    macroLights, 
    macroToScene 
} = await load("/vs-flow/remeshing/macros-3d")
const { 
    moduleControls, 
} = await load("/vs-flow/remeshing/modules")
const { 
    macroRemeshGeoms, 
} = await load("/vs-flow/remeshing/macros-remesh")

</js-cell>

## Picking & loading files

The following cell defines an initial workflow to pick, read, and display a file.
An `explorer` module is configured using a folder ID, when a file is selected it is forwarded
to a `reader` module, the result is finally displayed by the `textView` module:

<js-cell>
project = await project.with({
    workflow:{
        branches: [
            '(of#of)>>(explorer#explorer)>>(reader#reader)>>(view#textView)'
        ],
        configurations:{ 
            explorer: { 
                // The parent folder ID to explore
                parentId: '8a4049ad-0b39-45e3-9520-b9c6eeda4542' 
            },
            reader: {
                // Content of selected files is read as text.
                mode:'text' 
            },
            textView:{
                // Simple view definition, message (string) holds the selected file's content.
                 vdomMap: (message) => ({
                     tag: 'pre',
                     class: 'w-100 overflow-auto',
                     style: { height: '500px' },
                     children:[{class: 'w-100 h-100', innerText: message}]                 
                 }),
            }
        }
    }
})

display(project)
</js-cell>

In the above workflow, some modules are linked to a view,
identifiable by the presence of the <i class='fas fa-eye'></i> icon positioned above them.
Views can serve the purpose of solely displaying data, or, like in the case of
the **`explorer`** module, to also enable user interactions.


Let's gather the views of the `explorer` and `textView` modules:

<js-cell>
display(
    project.getHtml('explorer'), 
    Views.mx3, 
    project.getHtml('textView')
)
</js-cell>

<note level='hint'>
A note on the connections and their visual representation:
*  A gray connection signifies that it is closed and won't emit any new items.
   The connection following the **`of`** module appears gray because it emits just one item,
   which acts as a trigger for the `explorer` module before closing.
*  A dashed green connection indicates that it is open but has not yet transmitted data.
   these connections are in a waiting state, anticipating an item from the `explorer` module,
   which occurs when a file is selected.
</note>

**Layers**

Before moving on 3D visualization, the flow chart is re-organized in the next cell to group
together the modules **`of`**, **`explorer`**, **`reader`**, **`textView`**:

<js-cell>
project = await project.with({
     flowchart:{
         layers: [{
             layerId:'Loader',
             moduleIds:['of', 'explorer', 'reader','textView']
         }]
     }
})
display({project, wf:'main'})
</js-cell>

# 3D visualization

This section provides an overview of the process involved in creating the
components responsible for visualizing the 3D objects.
The toolbox used for 3D rendering is `@youwol/vsf-three`, it is a small wrapper
arounde the functionalities offered by the library
<a href='https://threejs.org' target='_blank'> Three.js </a>

## Introduction

Let's start introducing 3D visualization along with the concept of worksheet.

Worksheets are kind of 'side' projects that can be used to illustrate
or test some elements that are part of the main application but used in a
different context.

We define here a worksheet that illustrates the creation & visualization of
3D objects:

<js-cell>
wsId = "simple mesh visualization"
project = await project.with({
    worksheets: [{
        id: wsId,
        workflow: {
            branches:[
                "(of#of)>>(sphere#sphere)>>(combineLatest#combMesh)>>(mesh#mesh)>>(viewer#viewer)",
                "(#of)>>(standardMaterial#material)>>1(#combMesh)"                
            ],
            configurations:{
                material:{wireframe: true}
            }
        }
    }]
})

</js-cell>


After having executed the previous cell,it is possible to instantiate the created
worksheet and visualize its workflow:

<js-cell>
project = await project.runWorksheet(wsId)
let ws = project.runningWorksheets.find( ws => ws.worksheetId === wsId)
display({project, wf:ws.uid})
display({
    tag: 'div',
    style:{height: '500px'}, 
    children:[ws.instancePool.inspector().get('viewer').html()]
})
await project.stopWorksheets([ws.uid])
</js-cell>


Details regarding the creation of 3D scene is beyond the scope of this document,
the basic idea is to combine a description of a
<a href='https://threejs.org/docs/index.html?q=geometry#api/en/core/BufferGeometry' target="_blank">Geometry</a>
(`sphere` module) with a description of
<a href="https://threejs.org/docs/index.html?q=Material#api/en/materials/Material" target="_blank">Material</a>
(visual appearance, the `material` module) into
a so called <a href='https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh' target="_blank">Mesh</a>
(`mesh` module) that can be included in the `Viewer` module. 

To improve 3D display, two macros have been defined (and imported at the beginning of this page) 
in the [utilities page](@nav:/vs-flow-remeshing/utils):
*  `macroTo3dObject`: Takes a geometry and returns a nice 3D object.
*  `macroLights`: Returns lightning elements that can be added to the scene.

The following cell adds the macros to the project and defines a worksheet that illustrates them using an 
icosahedron geometry:

<js-cell>
project = await project.with({
    macros:[
        macroTo3dObject,
        macroLights
    ],
    worksheets:[{
        id:"to3dObject",
        workflow: {
            branches:[
                "(of#of)>>(icosahedron#geom)>>(to3dObject#3dObject)>>(combineLatest#scene)>>(viewer#viewer)",  
                "(lights#lights)>>1(#scene)"
            ]
        }
    }]
})
project = await project.runWorksheet("to3dObject")
ws = project.runningWorksheets.find( ws => ws.worksheetId === "to3dObject")
display({project, wf: ws.uid})
display({
    tag: 'div',
    style:{height: '500px'}, 
    children:[ws.instancePool.inspector().get('viewer').html()]
})
</js-cell>


An additional macro has been defined in the [utilities page](@nav:/vs-flow-remeshing/utils), it gathers the two previous
ones to:
*  Be able to accept a list of geometries in inputs, each one of them being transformed using `macroTo3dObject` thanks
to a map-reduce operation
*  Incorporate the lights.

Let's add it to the project, it will be illustrated just after.
<js-cell>
project = await project.with({
    macros:[macroToScene]
})
</js-cell>

# Loading GoCad models

The goals of this section are as follows:
*  To convert the file parsed using the `reader` module of the main
   workflow into a list of geometries (note that a file can contain multiple
   geometries) thanks to a `gocad` loader.
*  To employ the previously defined `macroToScene` macro to create a nice scene from the geometries emitted by the
   `gocad` module.
*  To include the output in a scene.

> The files used here are formatted as GOCAD files.
> GOCAD, an abbreviation for Geological Object Computer Aided Design,
> serves the purpose of modeling and visualizing geological data in a
three-dimensional context.

The following cell extends the project by introducing multiple elements
simultaneously, including macros, workflows, and views.
The key points are explained after the next cell, proceed by executing it
first.

<js-cell>
project = await project.with({
    workflow:{
        branches:['(reader#reader)>>(gocad#gocad)>>(toScene#sceneOriginal)>>(viewer#viewerRaw)'],
        configurations:{
            gocad:{
                center: true,
            },
        }
    }
})

display({project, wf:'main'})
</js-cell>

Let's display the `explorer` and `viewerRaw` module:
<js-cell>
display(project.getHtml('explorer'))
display(
    {
        tag: 'div',
        style:{height: '500px'},
        children:[project.getHtml('viewerRaw')]
    }
)
</js-cell>

Key points to note include:
*  In relation to the workflow:
   The primary workflow is expanded by incorporating the `gocad` module,
   which transforms the file's content into a list of geometries.
   Subsequently, the `toScene` macro (explained below) generates a scene
   with expected 3D objects. This scene is then passed to the `viewerRaw` module.
*  Concerning the toScene macro (expand it using the
   <i class='fas fa-expand'></i> icon):
   This macro utilizes the `mapReduce` module from `@youwol/vsf-rxjs` toolbox
   to apply the transformation defined by the `to3dObject` macro to each element within the incoming geometries
   (obtained from the gocad module).
   Because `purgeOnDone` is set to false, the different instances that have
   been created by the `mapReduce` module can be inspected, as well
   as their inner workflow (using the <i class='fas fa-expand'></i> icon).
   Additionally, the macro incorporates some lighting elements.
   The `scene` module finally collects all these elements.
*  Regarding the `Raw 3D view` view:
   It defines a view that combines both the `explorer` and the `viewer`
   within a horizontal layout.
   The view can be displayed from the **Views** node of the project explorer.

# Computations

## Uniform remesh worksheet

The remeshing step is realized using the `uniformRemeshing` module of the toolbox
`@youwol/vsf-pmp`. It wraps the method <a href="http://www.pmp-library.org/group__algorithms.html#ga1ddecfc2d08f5dbf820863acc79ee3bc">
uniform_remeshing</a> of the C++ library <a href="http://www.pmp-library.org">
Polygon Mesh Processing</a>.

The next cell create a simple worksheet that illustrates the usage of the module:
 
<js-cell>
project = await project.with({
    customModules:[moduleControls],
    worksheets:[{
        id:"uniform-remesh",
        workflow: {
            branches:[
                "(of#of)>>(icosahedron#geom)>>(fromThree#from)>>(combineLatest#comb)>#c0>(uniformRemeshing#remesh)>>(toThree#to)>#c1>(toScene#scene)>>(viewer#viewerRemesh)",
                "(control#ctrl)>>1(#comb)"
            ],
            configurations: {
                remesh:{ edgeFactor: 0.1 },
                c0: {
                    adaptor: ({data, context}) => ({
                        data:data[0], 
                        configuration:{ edgeFactor: data[1] }, 
                        context
                    })
                },
                c1: {
                    adaptor: ({data, context}) => ({data:[data], context})
                }
            }
        }
    }]
})
</js-cell>

Let's display the viewer with the remeshed geometry along with the control panels
<js-cell>
project = await project.runWorksheet("uniform-remesh")
ws = project.runningWorksheets.find( ws => ws.worksheetId === "uniform-remesh")
display({project, wf:ws.uid})
display(ws.instancePool.inspector().get('ctrl').html())
display({
    tag: 'div',
    style: { height: '500px' }, 
    children:[
        ws.instancePool.inspector().get('viewerRemesh').html(),
    ]
})
</js-cell>

<js-cell>
project = await project.with({
    workersPools:[{
        id: 'A',
        startAt: 1,
        stretchTo: 4
    }],
    macros:[macroRemeshGeoms]
})
</js-cell>

# Wrapping up

## Workflow

The main workflow is ultimately concluded with the inclusion of the `processMacro` and
`remeshCtrls` modules.
Additionally, a `pendingView` module has been integrated to offer feedback
during active computations.

To manage the execution of `processMacro`, a <a href="https://rxjs.dev/api/operators/switchMap">switchMap</a> 
policy is employed. 
This policy ensures that when a new computation is requested, any ongoing computations are terminated if they are 
still in progress.


<js-cell cell-id="final-wf">
project = await project.with({
    workflow:{
        branches: [
            '(control#ctrl)>>1(combineLatest#inputs)',
            '(#gocad)>>0(#inputs)>#cInputs>(switchMap#switch)',
            '(#switch)0>>(toScene#sceneComputed)>>(viewer#viewerResult)',        
            '(#switch)1>>(view#pendingView)'
        ],
        configurations:{ 
            switch:{
                project: ({data}) => ({
                    workflow: {
                        branches:['(remeshGeoms#all)'],
                        configurations: {
                            all: { edgeFactor: data[1] }
                    }},
                    input:'0(#all)',
                    output: '(#all)0',
                    message: {data: data[0]},
                    purgeOnDone: true,
                })
            },
            pendingView:{
                 state: {},
                 vdomMap: (message, module) => {
                     return {
                         class: 'w-100 text-center d-flex align-items-center',
                         children:message.modules.length > 0 ?[
                             {
                                 tag:'div', class:'fas fa-spinner fa-spin'
                             },
                             {	 tag:'div', class:'mx-2' },
                             {
                                 tag:'div', innerText: `${message.modules.length} pending computations`
                             }
                         ]: []
                     }
                 },
                 outputs: (state) => ({}),
            }
        }
    }
})

display({project, wf:'main'})
</js-cell>

<cell-output cell-id="final-wf" full-screen="true" style="width:100%;">
</cell-output>

## View

<js-cell cell-id="final-view">
const html = (instances) => ({
    tag: 'div',
    class:'w-100 h-100 d-flex fv-bg-background fv-text-primary',
    children:[
        {	class:'w-25 h-100 p-1 border d-flex flex-column',
            children: [
                instances.inspector().get('explorer').html(), 
            ]
        },   
        {	class:'flex-grow-1 h-100 d-flex',
            children:[
                {	class:'h-100 w-50 d-flex flex-column',
                    children:[
                        { 
                            class:'flex-grow-1',
                            style:{minHeight:'0px'},
                            children:[instances.inspector().get('viewerRaw').html()],
                        }
                    ]
                },
                {	class:'h-100 w-50 d-flex flex-column',
                    style:{ position: 'relative' },
                    children:[
                        {   
                            class: {
                                source$: instances.inspector().get('gocad').outputSlots.output$.observable$, 
                                vdomMap:() => 'w-100 d-flex justify-content-center',
                                untilFirst: 'd-none'
                            }, 
                            style:{ position: 'absolute', top:'5px' },
                            children:[{    
                                class:'px-3 py-1 fv-bg-background mx-3 rounded',
                                style:{ position: 'absolute', top:'5px' },
                                children: [
                                    instances.inspector().get('ctrl').html(),
                                    instances.inspector().get('pendingView').html()
                                ]
                            },]
                        },
                        { 
                            class:'flex-grow-1',
                            style:{minHeight:'0px'},
                            children:[instances.inspector().get('viewerResult').html()],
                        }
                    ]
                },
            ]
        }
    ]
})
project = await project.with({
    views:[{
        id: 'Application view',
        html
    }]
})
display(project.getHtml('Application view'))
</js-cell>

