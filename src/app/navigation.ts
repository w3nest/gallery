import { DefaultLayout, installNotebookModule, Navigation } from 'mkdocs-ts'

import { navigation as PresentationsNav } from './presentations'
import { navigation as VsFlowNav } from './vs-flow'
import { fromMd } from './config.markdown'
import { notebookPage } from './config.notebook'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const decorationHome = {
    wrapperClass: `${DefaultLayout.NavHeaderView.DefaultWrapperClass} border-bottom p-1`,
    icon: {
        tag: 'img' as const,
        style: {
            width: '30px',
            height: '30px',
        },
        src: '../assets/favicon.svg',
    },
}

export const navigation: AppNav = {
    name: 'Gallery',
    header: decorationHome,
    layout: fromMd('index.md'),
    routes: {
        '/presentations': PresentationsNav,
        '/sciences': {
            name: 'Sciences',
            header: {
                icon: { tag: 'div', class: 'fas fa-atom' },
            },
            layout: fromMd('sciences.md'),
            routes: {
                '/quantum-chem': {
                    name: 'Quantum Chemistry',
                    layout: ({ router }) =>
                        notebookPage('quantum-chem.md', router),
                    routes: {
                        '/utils': {
                            name: 'Utilities',
                            layout: {
                                content: ({ router }) =>
                                    notebookPage(
                                        'quantum-chem.utils.md',
                                        router,
                                    ),
                            },
                        },
                    },
                },
                '/tdse-1d': {
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
                },
            },
        },
        '/vs-flow': VsFlowNav,
    },
}
