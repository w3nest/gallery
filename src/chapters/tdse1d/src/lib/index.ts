import { DefaultLayout, Navigation } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import { Views } from '@mkdocs-ts/notebook'
export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

const eq = String.raw`\(i \hbar \frac{\partial}{\partial t} \left| \Psi(t) \right\rangle 
= \hat{H}(t) \left| \Psi(t) \right\rangle \)`

export const navigation: () => Promise<AppNav> = async () => {
    return {
        name: 'Schrödinger 1D',
        header: {
            icon: { tag: 'i', class: 'fas fa-atom' },
            name: new Views.Text(eq),
        },
        layout: ({ router }) => notebookPage('tdse-1d.md', router),
        routes: {
            '/backend': {
                name: 'Using Backend',
                header: {
                    icon: { tag: 'i', class: 'fas fa-network-wired' },
                },
                layout: ({ router }) =>
                    notebookPage('tdse-1d.backend.md', router),
            },
            '/utils': {
                name: 'Drawing Utils',
                header: {
                    icon: { tag: 'i', class: 'fas fa-tools' },
                },
                layout: {
                    content: ({ router }) =>
                        notebookPage('tdse-1d.utils.md', router),
                },
            },
        },
    }
}
