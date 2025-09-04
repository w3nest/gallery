import { DefaultLayout, Navigation } from 'mkdocs-ts'

import { navigation as presentationsNav } from './presentations'
import { navigation as VsFlowNav } from './vs-flow'
import { navigation as sciencesNav } from './sciences'

import { fromMd } from './config.markdown'
import { install } from '@w3nest/webpm-client'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>
export type ChapterNav = () => Promise<AppNav>
export type Chapter = {
    navigation: ChapterNav
}
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

const chapters = await install<{ tdse1D: Chapter }>({
    esm: ['@w3gallery/tdse-1d#^0.1.0 as tdse1D'],
})
console.log('Chapters', chapters)

export const navigation: AppNav = {
    name: 'Gallery',
    header: decorationHome,
    layout: fromMd('index.md'),
    routes: {
        '/presentations': presentationsNav,
        '/sciences': sciencesNav,
        '/vs-flow': VsFlowNav,
        '/tdse-1d': chapters.tdse1D.navigation(),
    },
}
