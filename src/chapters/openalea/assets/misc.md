
and imports some toolboxes:

<js-cell>
const { vsf } = await webpm.install({
    esm:[
        '@vs-flow/core#^0.4.0 as vsf',
    ],
    css: [`@vs-flow/flowchart-3d#^0.4.0~assets/style.css`,]
})
let project = new vsf.Projects.ProjectState()

project =  await project.with({
    toolboxes: {
        {{tb-rxjs}}
        {{tb-openalea}}
        {{tb-rx-vdom}}
        {{tb-three-js}}
        {{tb-tweakpane}}
    }
})
</js-cell>


<js-cell cell-id="example">
project =  await project.with({
    workflow: {
        branches: [
            `trigger >> QA`
        ],
        modules: {
            trigger: '🔀.of',
            QA: '🌳.quakingAspen',
        },
        configurations: {}
    }
})

display(project)
</js-cell>

<cell-output cell-id='example' defaultStyle="aspect-ratio:1" full-screen="true">
</cell-output>

