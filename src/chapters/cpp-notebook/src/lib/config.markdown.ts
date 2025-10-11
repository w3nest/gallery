import { fromMarkdown, IconFactory } from 'mkdocs-ts'
import { getUrlBase, resolveUrlWithFP } from '@w3nest/webpm-client'
import setup from '../../package.json'
import { navId } from './links'

export const url = (restOfPath: string) =>
    resolveUrlWithFP({
        package: setup.name,
        version: setup.version,
        path: `assets/${restOfPath}`,
    })

// Placeholders to replace in Markdown sources
export const placeholders = {
    '{{navId}}': navId,
    '{{package-name}}': setup.name,
    '{{package-version}}': setup.version,
}

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}
IconFactory.register({
    cpp: {
        tag: 'img',
        style: {
            height: '1.5em',
        },
        src: getUrlBase(setup.name, setup.version) + '/assets/C++.png',
    },
})
