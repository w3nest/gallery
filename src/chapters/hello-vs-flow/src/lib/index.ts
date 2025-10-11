import { DefaultLayout, Navigation, ContextTrait } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import setup from '../../package.json'

export { links } from './links'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const navigation = async ({
    context,
}: {
    context: ContextTrait
    mountPath: string
}) => {
    return {
        name: 'VS-Flow Showcase',
        header: {
            icon: {
                tag: 'img',
                width: 20,
                src: '/apps/@vs-flow/doc/latest/assets/favicon.png',
            },
        },
        layout: ({ router }) => notebookPage('home.md', router, context),
    } as AppNav
}

export const title = 'Short Showcase of Visual Studio Flow'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = `This page showcases a short example of creation a low-code application using
<ext-link target="hello-vs-flow.vs-flow">Visual Studio Flow</ext-link>.
It aims at illustrating important concepts while not diving into details.

The project loads a 3D bunny mesh, applies **remeshing** and **smoothing** with 
<ext-link target="hello-vs-flow.PMP">PMP</ext-link>, 
and renders it in real time with <ext-link target="hello-vs-flow.threeJs">Three.js</ext-link> — all in your browser, 
GPU-accelerated, and orchestrated off the main thread.
`
