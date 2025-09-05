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
        name: setup.name,
        header: {
            icon: { tag: 'i', class: 'fas fa-rocket' },
        },
        layout: ({ router }) => notebookPage('home.md', router, context),
        routes: {
            // Fill here to add children pages
        },
    } as AppNav
}

export const title = 'Build Your Own Chapter: Starter Template'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = `
This chapter provides a starter template to help you create and publish your own contribution to the gallery.
It demonstrates the minimal structure required for a chapter: navigation, metadata, Markdown rendering, etc.

See the <cross-link target="contribute"></cross-link> page for step-by-step instructions on how to customize it and 
share your own interactive scientific showcase
`
