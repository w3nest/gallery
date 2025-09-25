import { DefaultLayout, Navigation, ContextTrait } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import { Views } from '@mkdocs-ts/notebook'
import setup from '../../package.json'
import { getUrlBase, install } from '@w3nest/webpm-client'
import type * as CodeApiModule from '@mkdocs-ts/code-api'

import LinksDict from './links.json'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export async function installCodeApiModule() {
    const version = setup.devDependencies['@mkdocs-ts/code-api']
    const { CodeApi } = await install<{
        CodeApi: typeof CodeApiModule
    }>({
        esm: [`@mkdocs-ts/code-api#${version} as CodeApi`],
        css: [`@mkdocs-ts/code-api#${version}~assets/ts-typedoc.css`],
    })
    return CodeApi
}

const eq = String.raw`\(i \hbar \frac{\partial}{\partial t} \left| \Psi(t) \right\rangle 
= \hat{H}(t) \left| \Psi(t) \right\rangle \)`

export const navigation = async ({
    context,
    mountPath,
}: {
    context: ContextTrait
    mountPath: string
}) => {
    return {
        name: 'Schrödinger 1D',
        header: {
            icon: { tag: 'i', class: 'fas fa-atom' },
            name: new Views.Text(eq),
        },
        layout: ({ router }) => notebookPage('tdse-1d.md', router, context),
        routes: {
            '/backend': {
                name: 'Using Backend',
                header: {
                    icon: { tag: 'i', class: 'fas fa-network-wired' },
                },
                layout: ({ router }) =>
                    notebookPage('tdse-1d.backend.md', router, context),
                routes: {
                    '/api': installCodeApiModule().then((codeApiModule) =>
                        codeApiModule.codeApiEntryNode({
                            name: 'Backend Code API',
                            header: {
                                icon: { tag: 'i', class: `fas fa-code` },
                            },
                            entryModule: 'w3gallery_tdse1d',
                            dataFolder: `${getUrlBase(setup.name, setup.version)}/assets/api/tdse-1d`,
                            rootModulesNav: {
                                w3gallery_tdse1d: `@nav${mountPath}/backend/api`,
                            },
                            configuration: codeApiModule.configurationPython,
                        }),
                    ),
                },
            },
            '/utils': {
                name: 'Utils',
                header: {
                    icon: { tag: 'i', class: 'fas fa-tools' },
                },
                layout: {
                    content: ({ router }) =>
                        notebookPage('tdse-1d.utils.md', router, context),
                },
            },
        },
    } as AppNav
}

export const links = LinksDict

export const title =
    'Time-Dependent Schrödinger Equation in One Dimension (TDSE-1D)'
export const abstract = `
This chapter introduces the numerical study of the one-dimensional Time-Dependent Schrödinger Equation. 
The first part demonstrates how **Pyodide** can be integrated within **mkdocs-ts** to present the theoretical background 
and implement numerical recipes directly in the browser. The second part illustrates how **W3Nest** can be extended 
with a **custom backend service**, used here to compute eigenstates and simulate time evolution. 

Several canonical quantum scenarios are explored—including the harmonic oscillator, a Gaussian potential well, 
and tunneling through a double well—showing how eigenstates, spectra, and wave-packet dynamics reveal both classical 
analogies and uniquely quantum phenomena. 
Interactive visualization tools (D3.js and Chart.js) complement the simulations, enabling readers to directly 
connect numerical results with physical insights.
`
