import { install } from '@w3nest/webpm-client'
import { ContextTrait, DefaultLayout, Navigation } from 'mkdocs-ts'
import { chapterInputs } from './chapters'

/**
 * Represents the full application navigation structure for a chapter.
 *
 * This type is a specialization of the generic `Navigation` type
 * using `DefaultLayout.NavLayout` for the layout and `DefaultLayout.NavHeader` for the header.
 */
export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

/**
 * Defines a function that generates the navigation structure for a chapter.
 *
 * * `context` - The current context, providing access to routing and environment.
 * * `mountPath` - Mount path for the chapter within the application.
 */
export type ChapterNav = ({
    context,
    mountPath,
}: {
    context: ContextTrait
    mountPath: string
}) => Promise<AppNav>

/**
 * Represents a single chapter in the gallery.
 *
 * Each chapter must implement this interface to be compatible with the gallery system.
 */
export interface Chapter {
    /**
     * The display title of the chapter.
     */
    title: string
    /**
     * A short description or summary of the chapter content.
     */
    abstract: string
    /**
     * A function that returns the chapter navigation.
     */
    navigation: ChapterNav
    /**
     * Collections of links used in the chapter:
     * *  `extLinks` - External links to outside resources.
     * *  `apiLinks` - Links to API documentation.
     * *  `crossLinks` - Cross-links to other pages or chapters in the gallery.
     * *  `githubLinks` - Links to relevant GitHub repositories or files.
     */
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

export type InstalledChapter = Chapter & { nav: string }

export async function installChapters(): Promise<InstalledChapter[]> {
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
