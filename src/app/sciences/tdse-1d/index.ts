import { notebookPage } from '../../config.notebook'
import { AppNav } from '../../navigation'

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
