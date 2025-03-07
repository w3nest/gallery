import { ChildrenLike, CSSAttribute, VirtualDOM } from 'rx-vdom'

import { Router } from 'mkdocs-ts'
import { drawBackground } from './d3-drawings'

export class WelcomeScreen implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'w-100 d-flex flex-column justify-content-start '
    public readonly children: ChildrenLike
    public readonly style: CSSAttribute
    public readonly connectedCallback: (elem: HTMLElement) => void
    constructor({ router, d3 }: { router: Router; d3 }) {
        this.style = {
            position: 'relative',
            backgroundImage:
                ' linear-gradient(rgb(26, 26, 26), rgba(33, 37, 41,1.0))',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto 100%', // contain
            backgroundPosition: 'center',
            backgroundBlendMode: 'exclusion',
        }
        this.connectedCallback = (elem) => {
            drawBackground(elem, router, d3)
        }
    }
}
