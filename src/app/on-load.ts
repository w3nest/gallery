import { render } from 'rx-vdom'
import { navigation } from './navigation'
import { Router, DefaultLayout, PathAliasValue } from 'mkdocs-ts'
import { BehaviorSubject } from 'rxjs'
import { AuthBadge } from '@w3nest/ui-tk/Badges'
import { Footer } from '@w3nest/ui-tk/Mkdocs'
import { chapterInputs } from './chapters'

export const router = new Router<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader,
    keyof typeof chapterInputs
>({
    navigation,
    pathAliases: Object.keys(chapterInputs).reduce(
        (acc, e) => ({ ...acc, [e]: `@nav/${e}` }),
        {},
    ) as unknown as Record<keyof typeof chapterInputs, PathAliasValue>,
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
