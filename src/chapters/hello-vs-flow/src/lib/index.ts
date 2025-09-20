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
export const abstract = `
This chapter provides a short showcase of Visual Studio Flow
`
