import { DefaultLayout } from 'mkdocs-ts'

import { fromMd, setupGlobalLinks } from './config.markdown'
import { createRootContext } from './config.context'
import { HomePage } from './home-page'
import { AppNav, installChapters } from './chapters'

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
        },
    },
}
