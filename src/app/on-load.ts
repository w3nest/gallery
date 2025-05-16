import { render } from 'rx-vdom'
import { navigation } from './navigation'
import { Router, DefaultLayout } from 'mkdocs-ts'
import { BehaviorSubject } from 'rxjs'
import { AuthBadge } from '@w3nest/ui-tk/Badges'
import { Footer } from '@w3nest/ui-tk/Mkdocs'

export const router = new Router({
    navigation,
})

export const topStickyPaddingMax = '3rem'

const bookmarks$ = new BehaviorSubject(['/presentations', '/sciences'])

const footer = new Footer({
    license: 'MIT',
    copyrights: [
        { year: '2021', holder: 'YouWol' },
        { year: '2025', holder: 'Guillaume Reinisch' },
    ],
    github: 'https://github.com/w3nest/mkdocs-ts',
    npm: 'https://www.npmjs.com/package/mkdocs-ts',
    docGithub: 'https://github.com/w3nest/mkdocs-ts/tree/main/doc',
})

document.body.appendChild(
    render(
        new DefaultLayout.Layout({
            router,
            topBanner: {
                logo: {
                    icon: '../assets/favicon.svg',
                    title: 'Gallery',
                },
                expandedContent: new DefaultLayout.BookmarksView({
                    bookmarks$,
                    router,
                }),
                badge: new AuthBadge(),
            },
            footer,
            navFooter: true,
            bookmarks$,
            displayOptions: {
                pageVertPadding: '3rem',
            },
        }),
    ),
)
