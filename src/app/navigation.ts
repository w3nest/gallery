import {
    DefaultLayout,
    installNotebookModule,
    fetchMd,
    Navigation,
} from 'mkdocs-ts'

import { navigation as PresentationsNav } from './presentations'
import { fromMd } from './config.markdown'
import { notebookPage } from './config.notebook'

const NotebookModule = await installNotebookModule()

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const navigation: AppNav = {
    name: 'Home',
    header: {
        icon: { tag: 'div', class: 'fas fa-home' },
    },
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
    },
    //   "/vs-flow": {
    //     name: "Visual Studio Flow",
    //     decoration: {
    //       icon: { tag: "div", class: "fas fa-microchip" },
    //     },
    //     tableOfContent,
    //     html: fromMd("vs-flow.md"),
    //     "/tutorials": {
    //       name: "Tutorials",
    //       tableOfContent,
    //       html: fromMd("vs-flow.tutorials.md"),
    //       "/basics": {
    //         name: "Getting Started",
    //         tableOfContent,
    //         html: ({ router }) =>
    //           new NotebookModule.NotebookPage({
    //             url: url("vs-flow.tutorials.getting-started.md"),
    //             router,
    //             options: notebookOptions,
    //             displayFactory,
    //           }),
    //       },
    //       "/macros-ws": {
    //         name: "Macros & Worksheets",
    //         tableOfContent,
    //         html: ({ router }) =>
    //           new NotebookModule.NotebookPage({
    //             url: url("vs-flow.tutorials.macro-ws.md"),
    //             router,
    //             options: notebookOptions,
    //             displayFactory,
    //           }),
    //       },
    //     },
    //     "/remeshing": {
    //       name: "Bunny remeshing",
    //       tableOfContent,
    //       html: ({ router }) =>
    //         new NotebookModule.NotebookPage({
    //           url: url("vs-flow.bunny.md"),
    //           router,
    //           options: notebookOptions,
    //           displayFactory,
    //         }),
    //       "/macros-3d": {
    //         name: "Macros 3D",
    //         tableOfContent,
    //         html: ({ router }) =>
    //           new NotebookModule.NotebookPage({
    //             url: url("vs-flow.bunny.macro-3D.md"),
    //             router,
    //             options: notebookOptions,
    //           }),
    //       },
    //       "/macros-remesh": {
    //         name: "Macros Remesh",
    //         tableOfContent,
    //         html: ({ router }) =>
    //           new NotebookModule.NotebookPage({
    //             url: url("vs-flow.bunny.macro-remesh.md"),
    //             router,
    //             options: notebookOptions,
    //           }),
    //       },
    //       "/modules": {
    //         name: "Modules",
    //         tableOfContent,
    //         html: ({ router }) =>
    //           new NotebookModule.NotebookPage({
    //             url: url("vs-flow.bunny.modules.md"),
    //             router,
    //             options: notebookOptions,
    //           }),
    //       },
    //     },
    //   },
}
