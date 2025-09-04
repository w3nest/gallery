import { DefaultLayout, Navigation, ContextTrait } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import { Views } from '@mkdocs-ts/notebook'
import setup from '../../package.json'
import { getUrlBase, install } from '@w3nest/webpm-client'
import type * as CodeApiModule from '@mkdocs-ts/code-api'

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

export const navigation = async ({ context }: { context: ContextTrait }) => {
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
                                w3gallery_tdse1d: '@nav/tdse-1d/backend/api',
                            },
                            configuration: codeApiModule.configurationPython,
                        }),
                    ),
                },
            },
            '/utils': {
                name: 'Drawing Utils',
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
