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

export const title = 'Template project for starting a chapter'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = `
This chapter is the starter template. 
See the <cross-link target="contribute"></cross-link> page for more details.
`
