import {
    Views,
    installNotebookModule,
    fetchMd,
    Navigation,
} from '@youwol/mkdocs-ts'
import { setup } from '../auto-generated'
import { displayFactory } from './vsf'

const tableOfContent = Views.tocView

const url = (restOfPath: string) =>
    `/api/assets-gateway/cdn-backend/resources/${setup.assetId}/${setup.version}/assets/${restOfPath}`

const placeholders = {
    '{{rx-vdom-doc-url}}':
        'https://platform.youwol.com/applications/@youwol/rx-vdom-doc/latest?nav=/',
    '{{rx-vdom-doc}}':
        '<a target="_blank" href="https://platform.youwol.com/applications/@youwol/rx-vdom-doc/latest">rx-vdom</a>',
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

export const navigation: Navigation = {
    name: 'Home',
    tableOfContent,
    decoration: {
        icon: { tag: 'div', class: 'fas fa-home pe-1' },
    },
    html: fromMd('index.md'),
    '/sciences': {
        name: 'Sciences',
        decoration: {
            icon: { tag: 'div', class: 'fas fa-atom pe-1' },
        },
        tableOfContent,
        html: fromMd('sciences.md'),
        '/quantum-chem': {
            name: 'Quantum Chemistry',
            tableOfContent,
            html: ({ router }) =>
                new NotebookModule.NotebookPage({
                    url: url('quantum-chem.md'),
                    router,
                    options: notebookOptions,
                }),
            '/utils': {
                name: 'Utilities',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('quantum-chem.utils.md'),
                        router,
                        options: notebookOptions,
                    }),
            },
        },
        '/tdse-1d': {
            name: 'Schrödinger 1D',
            tableOfContent,
            html: ({ router }) =>
                new NotebookModule.NotebookPage({
                    url: url('tdse-1d.md'),
                    router,
                    options: notebookOptions,
                }),
            '/utils': {
                name: 'Utilities',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('tdse-1d.utils.md'),
                        router,
                        options: notebookOptions,
                    }),
            },
        },
    },
    '/vs-flow': {
        name: 'Visual Studio Flow',
        decoration: {
            icon: { tag: 'div', class: 'fas fa-microchip pe-1' },
        },
        tableOfContent,
        html: fromMd('vs-flow.md'),
        '/tutorials': {
            name: 'Tutorials',
            tableOfContent,
            html: fromMd('vs-flow.tutorials.md'),
            '/basics': {
                name: 'Getting Started',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('vs-flow.tutorials.getting-started.md'),
                        router,
                        options: notebookOptions,
                        displayFactory,
                    }),
            },
            '/macros-ws': {
                name: 'Macros & Worksheets',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('vs-flow.tutorials.macro-ws.md'),
                        router,
                        options: notebookOptions,
                        displayFactory,
                    }),
            },
        },
        '/remeshing': {
            name: 'Bunny remeshing',
            tableOfContent,
            html: ({ router }) =>
                new NotebookModule.NotebookPage({
                    url: url('vs-flow.bunny.md'),
                    router,
                    options: notebookOptions,
                    displayFactory,
                }),
            '/macros-3d': {
                name: 'Macros 3D',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('vs-flow.bunny.macro-3D.md'),
                        router,
                        options: notebookOptions,
                    }),
            },
            '/macros-remesh': {
                name: 'Macros Remesh',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('vs-flow.bunny.macro-remesh.md'),
                        router,
                        options: notebookOptions,
                    }),
            },
            '/modules': {
                name: 'Modules',
                tableOfContent,
                html: ({ router }) =>
                    new NotebookModule.NotebookPage({
                        url: url('vs-flow.bunny.modules.md'),
                        router,
                        options: notebookOptions,
                    }),
            },
        },
    },
}
