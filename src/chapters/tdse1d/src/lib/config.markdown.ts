import { fromMarkdown, GlobalMarkdownViews } from 'mkdocs-ts'
import { CrossLink, ExtLink, GitHubLink } from './md-widgets'
import { resolveUrlWithFP } from '@w3nest/webpm-client'
import setup from '../../package.json'

export const url = (restOfPath: string) =>
    resolveUrlWithFP({
        package: setup.name,
        version: setup.version,
        path: `assets/${restOfPath}`,
    })

GlobalMarkdownViews.factory = {
    ...GlobalMarkdownViews.factory,
    'ext-link': (elem: HTMLElement) => new ExtLink(elem),
    'cross-link': (elem: HTMLElement) => new CrossLink(elem),
    'github-link': (elem: HTMLElement) => new GitHubLink(elem),
}

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}

export const placeholders = {
    '{{rx-vdom-doc-url}}': '/apps/@rx-vdom/doc/latest',
    '{{rx-vdom-doc}}':
        '<a target="_blank" href="/apps/@rx-vdom/doc/latest">rx-vdom</a>',
}
