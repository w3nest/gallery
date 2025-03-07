import { fromMd } from '../config.markdown'
import { notebookPage } from '../config.notebook'
import { AppNav } from '../navigation'

export const navigation: AppNav = {
    name: 'VS-Flow',
    header: {
        icon: { tag: 'div', class: 'fas fa-puzzle-piece' },
    },
    layout: fromMd('vs-flow.md'),
    routes: {
        '/simple-remesh': {
            name: 'Simple 3D remesh',
            layout: ({ router }) =>
                notebookPage('vs-flow.simple-remesh.md', router),
        },
    },
}

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
