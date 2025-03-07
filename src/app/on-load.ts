import { ChildrenLike, CSSAttribute, render, VirtualDOM } from 'rx-vdom'
import { navigation } from './navigation'
import { Router, DefaultLayout, MdWidgets } from 'mkdocs-ts'
import { BehaviorSubject } from 'rxjs'

export const router = new Router({
    navigation,
})

export const topStickyPaddingMax = '3rem'

const bookmarks$ = new BehaviorSubject(['/', '/presentations', '/sciences'])

export class NavHeaderView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'd-flex align-items-center justify-content-center'
    public readonly children: ChildrenLike
    public readonly style: CSSAttribute

    constructor(params: { topStickyPaddingMax: string }) {
        this.style = {
            height: params.topStickyPaddingMax,
        }
        this.children = [
            {
                tag: 'a',
                class: 'mx-2',
                href: 'https://github.com/w3nest/gallery',
                children: [
                    {
                        ...MdWidgets.githubIcon,
                        style: {
                            filter: 'invert(1)',
                        },
                    },
                ],
            },
            {
                tag: 'a',
                class: 'mx-2',
                href: 'https://github.com/w3nest/gallery/blob/main/doc/LICENSE',
                children: [MdWidgets.mitIcon],
            },
        ]
    }
}

document.body.appendChild(
    render(
        new DefaultLayout.Layout({
            router,
            bookmarks$,
            displayOptions: {
                pageVertPadding: '3rem',
            },
            sideNavHeader: () => new NavHeaderView({ topStickyPaddingMax }),
        }),
    ),
)
