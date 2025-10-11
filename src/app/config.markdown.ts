import { fromMarkdown, GlobalMarkdownViews, MdWidgets } from 'mkdocs-ts'
import { Chapter } from './models'
import setup from '../../package.json'
import linksMap from './links.json'
import {
    templateConfigMarkdownTs,
    templateConfigNotebookTs,
    templateIndexTs,
    templateLinksTs,
    templateSetupPy,
} from './contribute-file-contents'

import { getW3NestCookie } from '@w3nest/webpm-client'
import { AnyVirtualDOM } from 'rx-vdom'
import { LocalOnly } from './widgets/local-only'

export const url = (restOfPath: string) => `../assets/${restOfPath}`

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}

export const placeholders = {
    '{{version}}': setup.version,
    '{{templateSetupPy}}': templateSetupPy,
    '{{templateIndexTs}}': templateIndexTs,
    '{{templateConfigMarkdownTs}}': templateConfigMarkdownTs,
    '{{templateConfigNotebookTs}}': templateConfigNotebookTs,
    '{{templateLinksTs}}': templateLinksTs,
}

export function setupGlobalLinks(chapters: Chapter[]) {
    const links = Object.values(chapters).reduce((acc, e) => {
        return {
            extLinks: { ...acc.extLinks, ...e.links.extLinks },
            apiLinks: { ...acc.apiLinks, ...e.links.apiLinks },
            crossLinks: { ...acc.crossLinks, ...e.links.crossLinks },
            githubLinks: { ...acc.githubLinks, ...e.links.githubLinks },
        }
    }, linksMap)

    MdWidgets.ApiLink.Mapper = (target: string) => {
        return links.apiLinks[target] as ReturnType<MdWidgets.LinkMapper>
    }
    MdWidgets.ExtLink.Mapper = (target: string) => {
        return {
            href: links.extLinks[target] as string,
        }
    }
    MdWidgets.GitHubLink.Mapper = (target: string) => {
        return {
            href: links.githubLinks[target] as string,
        }
    }
    MdWidgets.CrossLink.Mapper = (target: string) => {
        return {
            href: links.crossLinks[target] as string,
        }
    }
}

GlobalMarkdownViews.factory = {
    ...GlobalMarkdownViews.factory,
    localOnly: (): AnyVirtualDOM => {
        if (getW3NestCookie().type === 'remote') {
            return new LocalOnly()
        }
        return { tag: 'div' }
    },
}
