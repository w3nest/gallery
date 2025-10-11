
# <icon target="vsf"></icon> VS-Flow Showcase

---

This page showcases a short example of creation a low-code application using
<ext-link target="hello-vs-flow.vs-flow">Visual Studio Flow</ext-link>.
It aims at illustrating important concepts while not diving into details.
For detailed explanations, visit the dedicated <ext-link target="hello-vs-flow.vs-flow-tuto">Tutorials</ext-link>.


This project loads a 3D bunny mesh, applies **remeshing** and **smoothing** with 
<ext-link target="hello-vs-flow.PMP">PMP</ext-link>, 
and renders it in real time with <ext-link target="hello-vs-flow.threeJs">Three.js</ext-link> — all in your browser, 
GPU-accelerated, and orchestrated off the main thread.

---

## Setup

Let's import the core of VS-Flow:

<js-cell>
const { vsf } = await webpm.install({
    esm:[ '@vs-flow/core#^0.4.0 as vsf' ],
    css: [`@vs-flow/flowchart-3d#^0.4.0~assets/style.css`,]
})
let project = new vsf.Projects.ProjectState()
</js-cell>

and add some toolboxes:

<js-cell>

project =  await project.with({
    toolboxes: {
        {{tb-rxjs}}
        {{tb-pmp}}
        {{tb-rx-vdom}}
        {{tb-three-js}}
        {{tb-tweakpane}}
    }
})
</js-cell>

<note level="question" title="Toolboxes">
Toolboxes gathers modules, usually related to a given context, that can be used and connected in the project.
</note>

Let's also initialize a workers pool to execute computations off the main thread:

<js-cell>
project =  await project.with({
    workersPools:[{ 
        id: 'A', 
        startAt: 1, 
        stretchTo: 4
    }],
})
</js-cell>

---

## Macro definition

A macro describes a small sub-workflow that can be instantiated and configured at multiple place and time.
In this example we define a 2 modules macro:
1.  Applies remeshing on a given mesh (more on that just after)
2.  Applies smoothing from the remeshed surface.

This subgraph will be deployed in its own **worker thread** and orchestrated using a dedicated policy.

<js-cell>
const { Float } = vsf.Configurations

const macroRemesh = {
    typeId: 'macroRemesh',
    workflow: {
        branches: 'remesh >> smooth',
        modules: {
            remesh: '⚒️.uniformRemeshing',
            smooth: '⚒️.explicitSmoothing'
        }
    },
    api: {
        configuration:{
            schema:{
                resolution: new Float({value:1, min:0.3, max:10}),
                smoothingLevel: new Float({value:2, min:1, max:20})
            },
            mapper: (config) => ({
                remesh: { edgeFactor: config.resolution },
                smooth: { iterationCount: config.smoothingLevel }
            })
        },
        inputs:['0.remesh'],
        outputs:['smooth.0'],
    }
}
</js-cell>

---

## Full Workflow

The complete pipeline is about:
*  loading a 'bunny' mesh
*  creating a visual panel to play with parameters
*  trigger computations each time a new set of parameters is provided
*  display the resulting geometry


It becomes:

<js-cell cell-id="example">
project =  await project.with({
    macros:[ macroRemesh ],
    workflow: {
        branches: [
            `trigger >> bunny >> 0.latest >> switchMap >> convert >> viewer`,
            'pane >> 1.latest'
        ],
        modules: {
            trigger: '🔀.of',
            latest: '🔀.combineLatest',
            bunny: '⚒️.bunny',
            convert: '⚒️.toThree',
            viewer: '💎.viewer',
            switchMap: '🔀.switchMap',
            pane: '🎛️.pane'
        },
        configurations: {
            switchMap: {
                project: () => 'Macros.macroRemesh',
                innerConfigurations: ({data}) => ({
                    macroRemesh: { ...data[1], workersPoolId: 'A' }
                }),
                data: ({data}) => data[0]
            },
            pane:{
                schema: macroRemesh.api.configuration.schema,
                emitLastOnly: true,
            },
        }
    }
})

display(project)
</js-cell>

<cell-output cell-id='example' defaultStyle="aspect-ratio:1" full-screen="true">
</cell-output>

<note level="hint" title="Notes" expandable="true">

The `switchMap` module plays a crucial role as the orchestrator for macro execution. 
Each time a new task is submitted, it **cancels any ongoing computation** and starts the latest one. 
This ensures your workflow stays responsive without redundant processing.

Other orchestration strategies are also supported, such as:

* Running computations **in parallel**, collecting outputs as they complete
* **Queueing** tasks to run sequentially, waiting for the previous one to finish before starting the next

</note>


### View and Interaction

Every module in the graph can expose views (shown as <i class="fas fa-eye"></i> in the flowchart rendered). 
Here we manually combine the **viewer** and **settings panel** in a layout; a spinner also feedbacks about running
computations:

<js-cell cell-id='output'>
const switchMapPool$ = project.getObservable({
    moduleId: 'switchMap', 
    slotId:'instancePool$'
})

const view = Views.Layouts.superposed({
    content: Views.Layouts.viewPortOnly({
        content: project.getHtml('viewer')
    }),
    topLeft: project.getHtml('pane'),
    // A spinner when computing
    topRight: {
        tag: 'div', 
        class:{
            source$: switchMapPool$,
            vdomMap: ({data}) => data.modules.length > 0 
                ? 'fas fa-spinner fa-spin text-light' 
                : ''
        }
    }
})
display(view)
</js-cell>

<cell-output cell-id='output' defaultStyle="aspect-ratio:1" full-screen="true">
</cell-output>


### Pimp Your FlowChart

The 3D flowchart can be customized at multiple levels.
Here’s an example where we organize modules into two layers — **Data** and **View** — and add annotations that 
embed live UI elements into the flowchart:

<js-cell cell-id="flowchart">
project =  await project.with({
    flowchart: {
        layers: [
            {
                layerId: 'Data',
                moduleIds: ['trigger', 'bunny']
            },
            {
                layerId: 'View',
                moduleIds: ['convert', 'viewer']
            }
        ],
        annotations: [
            {
                selector: ({uid}) => ['View', 'viewer'].includes(uid),
                html: () => ({
                    tag:'div', 
                    style:{width:'500px', height:'500px'},
                    children:[project.getHtml('viewer')]
                }) 
            },
            {
                selector: ({uid}) => ['pane'].includes(uid),
                html: (elem) => elem.html()
            }
        ]
    }
})

display(project) 
</js-cell>

<cell-output cell-id='flowchart' defaultStyle="aspect-ratio:1" full-screen="true">
</cell-output>

---

## Summary

In just a few lines, we built a real-time, browser-native, GPU-powered 3D mesh processing tool — complete with UI, 
threading, and C++ compute — all in a declarative, modular workflow.
