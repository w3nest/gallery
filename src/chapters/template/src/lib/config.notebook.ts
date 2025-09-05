import { ContextTrait, Router } from 'mkdocs-ts'
import { NotebookPage } from '@mkdocs-ts/notebook'
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

export const notebookPage = (
    target: string,
    router: Router,
    context: ContextTrait,
) => {
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
