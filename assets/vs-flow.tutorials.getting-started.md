# Getting started

This page introduces the building concepts of the low-code solution VS-Flow.

Let's start by installing the core engine and create an empty project:

<js-cell>
const {VSF, Canvas } = await webpm.install({
    esm:['@youwol/vsf-core#^0.3.1 as VSF']
})
let project = new VSF.Projects.ProjectState()
</js-cell>

## Toolboxes

Projects are built by connecting modules to create a **flowchart**.
Modules are usually provided by toolboxes, they serve as organizational unit of modules.
It is also possible to create modules on-the-fly within a project, this option will be introduced later in this page.

<note level="hint">
Toolbox are lightweight ESM modules, with no dependencies most of the time.
This design ensures that loading toolboxes is almost instantaneous. 
Dependencies are associated to module, they get installed only at the time of module's instantiation.
</note>

The modules used in this page are imported from two toolboxes:
*  `@youwol/vsf-rxjs` : It gathers modules related to data-flow orchestration.
*  `@youwol/vsf-debug` : It gathers modules related to debugging. 


To add a toolbox, use the `.with` method of the project:

<js-cell>
project = await project.with({
    toolboxes:[
        '@youwol/vsf-rxjs',  // Flows management
        '@youwol/vsf-debug', // Display debug information
    ]
})
</js-cell>

<note level="info">
Projects are immutable structures. They are manipulated using the single `.with` method, which returns a new instance
of the project.
</note>

## Workflow

Our first workflow should display the current date for the 10 first seconds.
Let's first add a new branch in the project:

<js-cell>
project = await project.with({
    workflow:{
        branches: [
            '(timer#counter)>>(take#take10)>#c0>(map#date)>>(canvas#wfView)'
        ],
        configurations:{ 
            counter: { 
                interval: 1000,
                dueTime: 2000
            },
            take10: {
                count: 10
            },
            date:{
                project: ({data, context}) => ({data: new Date(), context})
            },
            wfView: {
                vDom: ({data}) => ({
                    tag: 'pre', 
                    class:'text-light pt-3', 
                    innerText:data.toLocaleTimeString()
                })
            }
        }
    }
})
</js-cell>

And display the project's flowchart:

<js-cell>
display(project)
</js-cell>

<expandable icon='fas fa-project-diagram' title="Branches">

Workflow gather branches. A **branch** of the workflow is defined using a synthax `(moduleA#idA)>>(moduleB#idB)>>...`:
*  `moduleA` & `moduleB` are the **type** of the modules, they should be exposed in one of the toolboxes already 
installed.
*   `idA` & `idB` are the **instance ID** of the modules; they are used to reference them later on.
*   dataflows follow the `>>` direction. Once data is emitted by a module, it can (should) not be modified anymore.
Messages are **immutable** structures.

It is also possible to provide ID to connections, just like for the `>#c0>` connection (ID is `c0`) included above.

In the above workflow:
*  The first module is of type `timer`: it emits 'tick' at a regular period of time.
*  The second module is of type `take`: it forwards incoming messages until a particular count
of messages has been reached.
*  The third module is of type `map`: it maps each incoming message to an outgoing message using a custom mapping 
function.
*  Finnaly the last module, of type `canvas`, allows displaying information within the flowchart.

</expandable>

<expandable icon='fas fa-wrench' title='Configurations'>

Defining a workflow also involved providing **configurations** to create the instance of the modules.
Configurations always have default values for all their fields, only overriding value need to be provided.

Configurations are provided with a `.configurations` attribute, it is an object with keys being the module ID, and 
values the fields of the module's configuration that needs to be overridden.

In the above example:
*  the module `counter` set the period of tick to 1000ms.
*  the module `take10` set the threshold count to incoming messages to 10.
*  the module `date` set the mapping function (called `project`) to return the current date.
*  the module `wfView` set the view mapping function (called `vDom`) to define a simple HTMDivElement with inner text 
   property as a nicely formatted date.

<note level='info'>
The configuration description of the modules, in particular the available options, are described in their documentation.

</note>


</expandable>

<expandable icon='fas fa-wifi' title='Connections'>

Connections support transmiting messages.
They have 2 possible states:
*  **<div class='text-success'>started</div>**: The connection can transmit data. Denoted by a green line (dashed when no data have transited yet) 
in the flowchart.
*  **<div class='text-muted'>completed</div>**: The connection does not transmit data anymore. It is denoted by a gray line in the flowchart.

You can refresh the project using the <i class='fas fa-sync'></i> button to observer the color of the connections:
*  until 2s all the connections appear with green dashed lines (the `counter` module did not emit yet).
*  after that and for the next 10 seconds, connections transmit data.
*  then the `take10` module stop further message forwarding (10 messages have already be intercepted), and 
   following connections are completed (displayed in gray). 
</expandable>

<expandable icon='fas fa-envelope' title='Messages'>

Each time a module receives a message, it triggers the associated
logic. Most of the time, modules feature only one input (that maps to a particular logic - or function), and incoming 
messages should provide **all** the data (arguments) required.

Messages have a structure composed by the three following attributes:
*  **`data`** : It vehicles the core data
*  **`configuration`**: Whenever it is set, the module receiving the message will use it to update its configuration
    for the processing
*  **`context`**: Serves at long range data forwarding, more on that latter

The `project` function of the `map` module - `({data, context}) => ({data: new Date(), context})` - illustrates 
this concept. The `data` & `context` attribute are extracted from the incoming message, while the outgoing message
provide a custom `data` attribute, and simply forward the incoming context.

<note level='warning'>
Latter in the course of the tutorial the usage of the `context` attribute will be illustrated.
In any case, it is a value set and read by the user: modules should not use it for their internal logic.
</note>

</expandable>

### Flowchart Annotations

It is possible to add simple reactive annotations to the flowchart to help understanding its behavior.
For now only modules of the flow chart can be annotated, connections will become available soon.

<note level='info'>
In general in VS-Flow projects, views are described using a `VirtualDOM` structure from the
{{rx-vdom-doc}} library. Its structure will be briefly presented in the next section.
</note>

For instance to include the tick count reaching the input slot of the `take10` module (called `input$`):

<js-cell>
project = await project.with({
    flowchart:{
        annotations:[
            {   // Selects the entity with uid 'take10' (i.e. the module 'take10')
                selector: (elem) => elem.uid === 'take10',
                // Provides a mapping function that returns a VirtualDOM.
                // The selector above ensures that 'module' is indeed the 'take10' module.
                html: (module) => ({
                    tag:'div',
                    class:'text-light', 
                    // innerText is a reactive attribute, see next section
                    innerText: {
                        source$:module.inputSlots.input$.rawMessage$,
                        vdomMap: (d) => `input$ received ${d.data}`
                    } 
                })
            }
        ]
    }
})
display(project)
</js-cell>

<note level='info'>
The name and role of the input/output slots of a module are described in the module's documentation.
</note>

<note level="hint">

Data flows are managed by rxjs Observable, they are fully compatible with the notebook.
They can be used for instance in the `display` function:

<js-cell>
const take10 = project.getModule('take10')
const raw$ = take10.inputSlots.input$.rawMessage$
display("Take 10 received:", Views.mx2, raw$.pipe( rxjs.map((d) => d.data)))
</js-cell>

Or within reactive cell:

<js-cell reactive='true'>
display(`Got a tick: ${raw$.data}`)
</js-cell>


</note>

## Views

As already mentioned, the views within VS-Flow are described using {{rx-vdom-doc}}'s VirtualDOM.
In a nutshell:
*  VirtualDOM mimic HTML element structure, with attributes and children, using a javascript object.
*  Attributes or children can be reactive by defining them from a `source$` observable and a `vdomMap` function.
Each time the `source$` emit an item, the `vdomMap` is executed, and the view updated.

As a simple example (that has nothing to do with VS-Flow):

<js-cell>
display({
    tag: 'div',
    class: 'p-2 rounded border',
    // innerText is a reactive attribute
    innerText: { 
        source$: rxjs.timer(0,1000),
        vdomMap: (_tick) => `It is ${new Date().toLocaleString()}`
    }
})
</js-cell>

Because dataflows in VS-Flow are constructed from Observable, they can be directly used within VirtualDOM to define
the `source$` attribute of reactive elements:

<js-cell>
display({
    tag: 'div',
    // class is a reactive attribute
    class: {
        source$: project.getConnection('c0').status$,
        vdomMap: (status) => status === 'completed' ? 'text-danger': 'text-success',
        wrapper: (d) => `${d} p-2 rounded border`
    },
    // innerText is a reactive attribute
    innerText: { 
        source$: raw$,
        vdomMap: (_tick) => `'take10' module got tick at ${new Date().toLocaleTimeString()}`
    }
})
</js-cell>

### Module's view

When defining a module, it is possible to associate a view to it, with which user can interact. 
Let's use a module that allows to provide a custom definition of its view (it is a particular case, usually module
just brings their own view without need of configuration).

The module belongs to the toolbox `@youwol/vsf-rx-vdom`:

<js-cell>
project = await project.with({
    toolboxes:[
        '@youwol/vsf-rx-vdom',
    ]
})
</js-cell>

The module `view` of  `@youwol/vsf-rx-vdom` relies on a configuration defining a `vdomMap` function taking as argument
the data part of incoming messages. Let's complete the current workflow by adding the new module:

<js-cell>
project = await project.with({
    workflow:{
        branches: [
            '(#wfView)>>(view#dateView)'
        ],
        configurations:{
            dateView: { 
                 vdomMap: (data) => ({
                     tag: 'div',
                     innerText: `It is : ${data.toLocaleTimeString()}`
                 }),
            }
        }
    }
})
display(project)
</js-cell>

Note that in the branches definition the `(#wfView)` declaration does not provide the type of the module: 
it is just a reference to a module that has already be defined that serves at starting point to the connection
of the new module `dateView`.

In the above flowchart, the module `dateView` is associated to a view, and provide a <i class='fas fa-eye'></i> icon,
click on it to display its view.

<note level="hint">

Being `VirtualDOM`, the views can be directly 'displayed' within notebook:
<js-cell>
// '.html()' returns the module's view
display(project.getModule('dateView').html())
</js-cell>
</note>

### Global views

The nice thing about module's view is that they can be aggregated to define globale (or application) views within
specific layout.

To illustrates this, let's first define another `view` module in the workflow, it simply display the tick index of 
the module `counter`:

<js-cell>
project = await project.with({
    workflow:{
        branches: [
            '(#counter)>>(view#counterView)'
        ],
        configurations:{
            counterView: { 
                 vdomMap: (data) => ({
                     tag: 'div',
                     innerText: `Tick: ${data}`
                 }),
            }
        }
    }
})
display(project)
</js-cell>


And, to registrate a view gathering `dateView` & `counterView` within a specific layout:

<js-cell>
project = await project.with({
    views:[{
        id: 'globalView',
        html: (instances) => ({
            tag: 'div',
            class: 'border rounded p-2',
            children:[
                instances.get('counterView').html(),
                {
                    tag:'div',
                    innerText: {
                        source$: instances.get('c0').status$,
                        vdomMap: (status) => status === 'completed' 
                            ? 'Take10 has completed'
                            : 'Take10 is active'
                    }
                },
                instances.get('dateView').html(),
            ]       
        })
    }]
})
display(project.getHtml('globalView'))
</js-cell>

In this example:
*  The view is registered using an ID (`globalView`) and an `html` generator - a function that takes the availables 
running instances of the project and returns a VirtualDOM.
*  It is possible to combine the individual view of some modules, but also to define other elements that can react to 
the various observables of the project.
*  Multiple global views can be defined for a project, serving different pruposed (e.g. debug, detailed, etc.).

## Organization

**Grouping**

It is possible to group modules together to organize the flow chart.
This operation does not change any logical aspects of the workflow, it is solely a visualization option of the flowchart.

Grouping is executed by providing layers definition within a `flowchart` object:

<js-cell>
project = await project.with({
    flowchart:{
        layers:[
            { 
                layerId: 'counter',
                moduleIds:['counter', 'counterView']
            }
        ]
    }
})
display(project)
</js-cell>



## Custom module

Let's finish this first overview by providing a simple example of custom module definition.


<js-cell>
class State{
    constructor(){
        this.value$ = new rxjs.BehaviorSubject(1)
    }
}
const moduleControls = new VSF.Modules.Module({
    declaration: {
        typeId: 'control',
        dependencies: {
            modules:['tweakpane#^4.0.1 as TP']
        }
    },
    implementation: ({fwdParams}) => {
        const state = new State()
        const TP = fwdParams.env.TP
        return new VSF.Modules.Implementation(
            {
                configuration: {schema: {
                     // to be completed
                }},
                inputs: {
                     // to be completed
                },
                outputs: (arg) => ({
                     // to be completed
                }),
                html: () => {
                    return { 
                        tag: 'div',
                        children: [
                            // to be completed
                        ] 
                    }
                },
                state,
            },
            fwdParams,
        )
    }
})

</js-cell>

Designing a module is a topic that will be covered in more extends in the dedicated page, as a teaser
*  modules can bring dependencies be it ESM modules, pyodide python or even backends
*  contracts
*  state


## Wrap-up


## What's next
