# <icon target="openalea"></icon> Openalea Low-Code
---

This page demonstrates how to create a **low-code simulation workflow** using
<ext-link target="openalea.vs-flow">Vs-Flow</ext-link>.  
We’ll combine interactive flow-based programming with plant simulation modules.

---

## Setup

We first install all the required packages:  

- **VS-Flow core** (`@vs-flow/core`) for flowchart management.  
- **OpenAlea interpreter backend** (`openalea_interpreter`) so we can execute Python code in the browser. 
- **CSS styles** for the 3D flowchart view.  

<js-cell>

const { vsf, openalea} = await webpm.install({
    esm:[
        '@vs-flow/core#^0.4.0 as vsf',
    ],
    css: [`@vs-flow/flowchart-3d#^0.4.0~assets/style.css`,]
})
</js-cell>

We also initialize an empty project state (`vsf.Projects.ProjectState`) and attach toolboxes 
for `RxJS`, `OpenAlea`, and `Three.js` to provide reactive operators, plant models, and 3D visualization. 


<js-cell>

let project = new vsf.Projects.ProjectState()
project =  await project.with({
    toolboxes: {
        {{tb-rxjs}}
        {{tb-openalea}}
        {{tb-three-js}}
    }
})
</js-cell>

---

## Simple Workflow

Now that the environment is ready, we can define a **workflow graph**.  
This workflow simulates a **Quaking Aspen tree** using the **Weber–Penn** model:  

- **trigger**: provides the initial event that starts the flow.  
- **QA** (`🌳.quakingAspen`): defines default physiological parameters for the tree.  
- **MTG** (`🌳.defaultMtg`): generates a multiscale tree graph (branching structure).  
- **simulation** (`🌳.weberMtg`): runs the Weber–Penn tree growth algorithm.  
- **plot** (`🌳.mtgPlot`): extracts a geometric representation.  
- **viewer**: visualizes the tree in 3D with Three.js.  

We also specify configuration for `MTG` (the axes list describing branching).  
Additionally, a flowchart layer and annotation are set up to **display the 3D viewer at 800×800 pixels**.


<js-cell cell-id="flowchart">
project =  await project.with({
    workflow: {
        branches: [
            'trigger >> QA >> latest >> simulation >> plot >> viewer',
            'trigger >> MTG >> 1.latest'
        ],
        modules: {
            trigger: '🔀.of',
            latest:'🔀.combineLatest',
            QA: '🌳.quakingAspen',
            MTG: '🌳.defaultMtg',
            simulation: '🌳.weberMtg',
            plot: '🌳.mtgPlot',
            viewer: '💎.viewer',
        },
        configurations: {
            MTG: {
                axes: [[2, 4, 1], [1, 0, 2, 0], [0, 0]]
            }
        }
    },
    flowchart: {
        layers: [
            {
                layerId: 'Simulation',
                moduleIds: ['trigger', 'latest', 'QA', 'MTG', 'simulation']
            }
        ],
        annotations: [
            {
                selector: ({uid}) => ['viewer'].includes(uid),
                html: () => ({
                    tag:'div', 
                    style:{width:'800px', height:'800px'},
                    children:[project.getHtml('viewer')]
                }) 
            }
        ]
    }
})

display(project)
</js-cell>

<cell-output cell-id='flowchart' defaultStyle="aspect-ratio:1" full-screen="true">
</cell-output>