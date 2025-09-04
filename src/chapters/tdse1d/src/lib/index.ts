import { DefaultLayout, Navigation } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const navigation: AppNav = {
    name: 'Schrödinger 1D',
    layout: ({ router }) => notebookPage('tdse-1d.md', router),
    routes: {
        '/utils': {
            name: 'Utilities',
            layout: {
                content: ({ router }) =>
                    notebookPage('tdse-1d.utils.md', router),
            },
        },
    },
}
