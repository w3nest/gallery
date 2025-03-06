import {
    DefaultLayout,
    installNotebookModule,
    fetchMd,
    Navigation,
} from 'mkdocs-ts'

const url = (restOfPath: string) => `../assets/${restOfPath}`

const placeholders = {
    '{{rx-vdom-doc-url}}': '/apps/@rx-vdom/doc/latest',
    '{{rx-vdom-doc}}':
        '<a target="_blank" href="/apps/@rx-vdom/doc/latest">rx-vdom</a>',
}

function fromMd(file: string) {
    return fetchMd({
        url: url(file),
        placeholders,
    })
}
const NotebookModule = await installNotebookModule()
const notebookOptions = {
    runAtStart: true,
    defaultCellAttributes: {
        lineNumbers: false,
    },
    markdown: {
        latex: true,
        placeholders,
    },
}

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const navigation: AppNav = {
    name: 'Home',
    header: {
        icon: { tag: 'div', class: 'fas fa-home pe-1' },
    },
    layout: fromMd('index.md'),
    routes: {
        '/sciences': {
            name: 'Sciences',
            header: {
                icon: { tag: 'div', class: 'fas fa-atom pe-1' },
            },
            layout: fromMd('sciences.md'),
            routes: {
                '/quantum-chem': {
                    name: 'Quantum Chemistry',
                    layout: ({ router }) =>
                        new NotebookModule.NotebookPage({
                            url: url('quantum-chem.md'),
                            router,
                            options: notebookOptions,
                        }),
                    routes: {
                        '/utils': {
                            name: 'Utilities',
                            layout: ({ router }) =>
                                new NotebookModule.NotebookPage({
                                    url: url('quantum-chem.utils.md'),
                                    router,
                                    options: notebookOptions,
                                }),
                        },
                    },
                },
                '/tdse-1d': {
                    name: 'Schrödinger 1D',
                    layout: ({ router }) =>
                        new NotebookModule.NotebookPage({
                            url: url('tdse-1d.md'),
                            router,
                            options: notebookOptions,
                        }),
                    routes: {
                        '/utils': {
                            name: 'Utilities',
                            layout: ({ router }) =>
                                new NotebookModule.NotebookPage({
                                    url: url('tdse-1d.utils.md'),
                                    router,
                                    options: notebookOptions,
                                }),
                        },
                    },
                },
            },
        },
    },
    //   "/vs-flow": {
    //     name: "Visual Studio Flow",
    //     decoration: {
    //       icon: { tag: "div", class: "fas fa-microchip pe-1" },
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
