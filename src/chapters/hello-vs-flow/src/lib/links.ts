import setup from '../../package.json'

export const navId = setup.name.split('/').slice(-1)[0]
/**
 * Links are referenced in the Markdown source like:
 *
 * * `<cross-link target="...">Foo</cross-link>` → internal navigation inside the gallery
 * * `<ext-link target="...">Bar</ext-link>` → external links (docs, websites, APIs)
 * * `<github-link target="...">Baz</github-link>` → point directly to files in the repo
 *
 * Why?
 * - Centralizing all links here makes them reusable.
 * - It also prevents "hardcoding" links inside Markdown that could break later.
 *
 * ⚠️ Important: Links are *global*.
 * To avoid collisions, **always prefix your keys with your chapter ID**
 * (e.g. `template.*` if your chapter is mounted under `template`).
 */
export const links = {
    crossLinks: {
        // 🔗 Cross-links: jump to other pages within the same gallery instance
        // Example: for a sub-page mounted at '/sub-page' under chapter 'template',
        // the key is 'template.sub-page', and the value points to its nav ID.
        //[`${navId}.sub-page`]: `@nav[${navId}]/backend`,
    },
    extLinks: {
        // 🌍 External links: reference third-party sites, libraries, or docs
        //[`${navId}.mkdocs-ts`]: '/apps/@w3nest/doc/latest',
    },
    githubLinks: {
        // 🐙 GitHub links: direct references to source files for this chapter
        // Useful for contributors to quickly find where content lives.
        // [`${navId}.repo`]:
        //     'https://github.com/w3nest/gallery/tree/main/src/chapters/template',
    },
}
