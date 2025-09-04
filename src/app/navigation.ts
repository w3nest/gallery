import { ContextTrait, DefaultLayout, Navigation } from 'mkdocs-ts'

import { fromMd, setupGlobalLinks } from './config.markdown'
import { install } from '@w3nest/webpm-client'
import { createRootContext } from './config.context'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>
export type ChapterNav = ({
    context,
}: {
    context: ContextTrait
}) => Promise<AppNav>

export type Chapter = {
    navigation: ChapterNav
    links: {
        extLinks: Record<string, string>
        apiLinks: Record<string, string>
        crossLinks: Record<string, string>
        githubLinks: Record<string, string>
    }
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

setupGlobalLinks(Object.values(chapters))

export const navigation: AppNav = {
    name: 'Gallery',
    header: decorationHome,
    layout: ({ router }) => new HomePage({ chapters, router }),
    routes: {
        '/tdse-1d': chapters.tdse1D.navigation({
            context: createRootContext({ threadName: 'tdse-1d' }),
        }),
    },
}
