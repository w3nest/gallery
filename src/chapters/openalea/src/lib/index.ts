import { DefaultLayout, Navigation, ContextTrait, Router } from 'mkdocs-ts'
import * as NotebookModule from '@mkdocs-ts/notebook'
import { displayVsfProject, notebookPage } from './config.notebook'
import setup from '../../package.json'
import { getUrlBase } from '@w3nest/webpm-client'

import { apiNav as NavTbOpenalea } from '@vs-flow/tb-openalea/Doc'

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
        name: 'Openalea Showcase',
        header: {
            icon: {
                tag: 'img',
                width: 20,
                src:
                    getUrlBase(setup.name, setup.version) +
                    '/assets/openalea.png',
            },
        },
        layout: ({ router }) => notebookPage('home.md', router, context),
        routes: {
            '/worksheet': {
                name: 'Worksheet',
                header: {
                    icon: {
                        tag: 'div',
                        innerText: '📓',
                    },
                },
                layout: ({ router }) =>
                    notebookPage('worksheet.md', router, context),
            },
            '/vs-flow': {
                name: 'VS-Flow',
                header: {
                    icon: {
                        tag: 'div',
                        innerText: '🔀',
                    },
                },
                layout: ({ router }) =>
                    notebookPage('vs-flow.md', router, context),
            },
            '/api': NavTbOpenalea({
                rootModulesNav: {
                    self: '@nav/openalea/api',
                    'vsf-core': '@nav/api/vsf-core',
                },
                displayVsfProject: (
                    _Notebook: typeof NotebookModule,
                    router?: Router,
                ) => displayVsfProject(router),
            }),
        },
    } as AppNav
}

export const title = 'Showcase of Openalea low-code modules'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = `
This chapter provides a short showcase of Openalea using low-code engine.
`
