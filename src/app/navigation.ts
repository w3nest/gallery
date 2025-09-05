import { DefaultLayout } from 'mkdocs-ts'

import { fromMd, setupGlobalLinks } from './config.markdown'
import { createRootContext } from './config.context'
import { HomePage } from './home-page'
import { AppNav, installChapters } from './models'
import setup from '../../package.json'
import { install } from '@w3nest/webpm-client'
import type * as CodeApiModule from '@mkdocs-ts/code-api'

export const decorationHome = {
    wrapperClass: `${DefaultLayout.NavHeaderView.DefaultWrapperClass} border-bottom p-1`,
    icon: {
        tag: 'img' as const,
        style: {
            width: '30px',
            height: '30px',
        },
        src: '../assets/favicon.png',
    },
}

const chapters = await installChapters()
console.log('Chapters', chapters)

setupGlobalLinks(chapters)

const chaptersNav = chapters.reduce((acc, e) => {
    return {
        ...acc,
        [e.nav]: e.navigation({
            context: createRootContext({ threadName: 'tdse-1d' }),
            mountPath: e.nav,
        }),
    }
}, {})

export const navigation: AppNav = {
    name: 'Gallery',
    header: decorationHome,
    layout: ({ router }) => new HomePage({ chapters, router }),
    routes: {
        ...chaptersNav,
        '/contribute': {
            name: 'Contribute',
            header: {
                icon: { tag: 'i', class: 'fas fa-code-branch' },
            },
            layout: fromMd('contribute.md'),
            routes: {
                '/api': apiNav(),
            },
        },
    },
}

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

async function apiNav(): Promise<AppNav> {
    const CodeApiModule = await installCodeApiModule()

    const module = 'gallery'
    const context = createRootContext({
        threadName: `CodeAPI`,
        labels: ['CodeApi'],
    })

    return {
        ...CodeApiModule.codeApiEntryNode(
            {
                name: 'API',
                header: {
                    icon: {
                        tag: 'i' as const,
                        class: 'fas fa-code',
                    },
                },
                entryModule: module,
                dataFolder: `../assets/api/`,
                rootModulesNav: {
                    gallery: '@nav/contribute/api',
                },
                configuration: CodeApiModule.configurationTsTypedoc,
            },
            context,
        ), // Explicitly set no children.
        routes: undefined,
    }
}
