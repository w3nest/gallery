import { notebookPage } from '../../config.notebook'
import { AppNav } from '../../navigation'

export const navigation: AppNav = {
    name: 'Quantum Chemistry',
    layout: ({ router }) => notebookPage('quantum-chem.md', router),
    routes: {
        '/utils': {
            name: 'Utilities',
            layout: {
                content: ({ router }) =>
                    notebookPage('quantum-chem.utils.md', router),
            },
        },
    },
}
