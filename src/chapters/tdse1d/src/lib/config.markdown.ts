import { fromMarkdown } from 'mkdocs-ts'
import { resolveUrlWithFP } from '@w3nest/webpm-client'
import setup from '../../package.json'

export const url = (restOfPath: string) =>
    resolveUrlWithFP({
        package: setup.name,
        version: setup.version,
        path: `assets/${restOfPath}`,
    })

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}

export const placeholders = {}
