import { Router } from 'mkdocs-ts'
import { NotebookPage } from '@mkdocs-ts/notebook'
import { createRootContext } from './config.context'
import { placeholders, url } from './config.markdown'

export const notebookOptions = {
    runAtStart: true,
    defaultCellAttributes: {
        lineNumbers: false,
    },
    markdown: {
        latex: true,
        placeholders,
    },
}

export const notebookPage = (target: string, router: Router) => {
    const context = createRootContext({
        threadName: `Notebook(${target})`,
        labels: ['Notebook'],
    })
    return new NotebookPage(
        {
            url: url(target),
            router,
            options: notebookOptions,
            initialScope: {
                const: {},
                let: {},
            },
        },
        context,
    )
}
