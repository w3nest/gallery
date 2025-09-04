import { fromMarkdown, MdWidgets } from 'mkdocs-ts'
import { Chapter } from './chapters'
import setup from '../../package.json'
import linksMap from './links.json'

export const url = (restOfPath: string) => `../assets/${restOfPath}`

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}

export const placeholders = {
    '{{version}}': setup.version,
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
