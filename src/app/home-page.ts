import {
    AnyVirtualDOM,
    ChildrenLike,
    VirtualDOM,
    child$,
    render,
} from 'rx-vdom'
import { from } from 'rxjs'
import { fromMd } from './config.markdown'
import { Router, MdWidgets, parseMd } from 'mkdocs-ts'

function patchAbstractWithLink(nav: string, abstract: string) {
    return `${abstract}\n👉 Launch it from [here](@nav/${nav}).`
}
export class HomePage implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly children: ChildrenLike

    public readonly connectedCallback: (elem: HTMLElement) => void
    constructor({
        chapters,
        router,
    }: {
        chapters: { title: string; abstract: string; nav: string }[]
        router: Router
    }) {
        this.children = [
            child$({
                source$: from(fromMd('home.md')({ router })),
                vdomMap: (view) => {
                    return {
                        tag: 'div',
                        children: [view],
                        connectedCallback: (elem) => {
                            const placeholder =
                                elem.querySelector('#chapters-abstract')
                            const chaptersView: AnyVirtualDOM = {
                                tag: 'div',
                                children: chapters.map(
                                    ({ title, abstract, nav }) => {
                                        const patched = patchAbstractWithLink(
                                            nav,
                                            abstract,
                                        )
                                        const abstractView =
                                            new MdWidgets.NoteView({
                                                level: 'info',
                                                label: title,
                                                icon: 'fas fa-book',
                                                content: parseMd({
                                                    src: patched,
                                                }),
                                                expandable: true,
                                            })
                                        return {
                                            tag: 'div',
                                            class: 'my-2',
                                            children: [abstractView],
                                        }
                                    },
                                ),
                            }
                            placeholder.replaceWith(render(chaptersView))
                        },
                    }
                },
            }),
        ]
    }
}
