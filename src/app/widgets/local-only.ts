import { ChildrenLike, VirtualDOM } from 'rx-vdom'
import { MdWidgets } from 'mkdocs-ts'

export class LocalOnly implements VirtualDOM<'div'> {
    tag = 'div' as const
    children: ChildrenLike

    constructor() {
        const text = `
This page must be run through the <ext-link target="w3nest">W3Nest</ext-link> **local server**, which automatically
sets up the required backend for execution. (**It cannot be executed directly from \`https://w3nest.org\`**.)
`
        this.children = [
            new MdWidgets.NoteView({
                level: 'failure',
                label: 'Unable to run online',
                content: text,
            }),
        ]
    }
}
