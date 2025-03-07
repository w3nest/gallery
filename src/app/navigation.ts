import { DefaultLayout, Navigation } from 'mkdocs-ts'

import { navigation as presentationsNav } from './presentations'
import { navigation as VsFlowNav } from './vs-flow'
import { navigation as sciencesNav } from './sciences'

import { fromMd } from './config.markdown'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const decorationHome = {
    wrapperClass: `${DefaultLayout.NavHeaderView.DefaultWrapperClass} border-bottom p-1`,
    icon: {
        tag: 'img' as const,
        style: {
            width: '30px',
            height: '30px',
        },
        src: '../assets/favicon.svg',
    },
}

export const navigation: AppNav = {
    name: 'Gallery',
    header: decorationHome,
    layout: fromMd('index.md'),
    routes: {
        '/presentations': presentationsNav,
        '/sciences': sciencesNav,
        '/vs-flow': VsFlowNav,
    },
}
