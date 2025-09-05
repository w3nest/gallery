import { install } from '@w3nest/webpm-client'
import { ContextTrait, DefaultLayout, Navigation } from 'mkdocs-ts'

/**
 * Add entries here to add chapter.
 *
 * Mapping `nav-id` -> `module ID`
 */
export const chapterInputs = {
    'tdse-1d': '@w3gallery/tdse-1d#^0.1.0',
}

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export type ChapterNav = ({
    context,
    mountPath,
}: {
    context: ContextTrait
    mountPath: string
}) => Promise<AppNav>

export type Chapter = {
    title: string
    abstract: string
    navigation: ChapterNav
    links: {
        extLinks: Record<string, string>
        apiLinks: Record<string, string>
        crossLinks: Record<string, string>
        githubLinks: Record<string, string>
    }
}

type ChapterModules = {
    [K in keyof typeof chapterInputs]: Chapter
}

export async function installChapters(): Promise<
    (Chapter & { nav: string })[]
> {
    const esm = Object.entries(chapterInputs).map(([nav, spec]) => {
        return `${spec} as ${nav}`
    })
    const modules = (await install<ChapterModules>({
        esm,
    })) as ChapterModules

    return Object.entries(modules).map(([nav, chapterModule]) => ({
        ...chapterModule,
        nav: `/${nav}`,
    }))
}
