import { DefaultLayout, Navigation, ContextTrait } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import { getUrlBase } from '@w3nest/webpm-client'
export { links } from './links'
import setup from '../../package.json'

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
        name: 'C++ in Notebook',
        header: {
            icon: {
                tag: 'img',
                width: 20,
                src: getUrlBase(setup.name, setup.version) + '/assets/C++.png',
            },
        },
        layout: ({ router }) => notebookPage('home.md', router, context),
        routes: {
            '/code-utils': {
                name: 'Code Utils',
                header: {
                    icon: {
                        tag: 'i',
                        width: 20,
                        class: 'fa fa-code',
                    },
                },
                layout: {
                    content: ({ router }) =>
                        notebookPage('code-utils.md', router, context),
                },
            },
        },
    } as AppNav
}

export const title = 'Short Showcase of MkDocs-TS notebook feature'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = `
This chapter provides a short showcase of MkDocs-TS notebook feature
`
