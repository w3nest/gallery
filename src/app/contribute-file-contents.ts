export const templateSetupPy = `
from shutil import copyfile
from pathlib import Path

from w3nest.ci.ts_frontend import (
    ProjectConfig,
    PackageType,
    Dependencies,
    RunTimeDeps,
    DevServer,
    Bundles,
    MainModule,
    generate_template,
)

from w3nest.utils import parse_json

project_folder = Path(__file__).parent.parent

pkg_json = parse_json(project_folder / "package.json")

root_pkg_json = parse_json(project_folder / ".." / ".." / ".." / "package.json")
root_deps = root_pkg_json["webpm"]["dependencies"]

# These dependencies are not included in the bundle
# They are fetched from NPM for project setup, and from webpm for runtime linking.
externals_deps = {
    k: root_deps[k]
    for k in ["@w3nest/webpm-client", "mkdocs-ts", "@mkdocs-ts/notebook"]
}
# These dependencies are included in the bundle
in_bundle_deps = {}

# Dev. only dependencies (not used at runtime)
dev_deps = {}

config = ProjectConfig(
    path=project_folder,
    type=PackageType.LIBRARY,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(externals=externals_deps, includedInBundle=in_bundle_deps),
        devTime=dev_deps,
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./lib/index.ts", loadDependencies=list(externals_deps.keys())
        ),
    ),
    devServer=DevServer(port=3023),
)

template_folder = Path(__file__).parent / ".template"

generate_template(config=config, dst_folder=template_folder)

# Comment out or remove the files that should not be auto-generated
files = [
    ".gitignore",
    "README.md",
    "package.json",
    "tsconfig.json",
    "jest.config.ts",
    "webpack.config.ts",
    "typedoc.js",
]
for file in files:
    copyfile(src=template_folder / file, dst=project_folder / file)

`

export const templateIndexTs = `
import { DefaultLayout, Navigation, ContextTrait } from 'mkdocs-ts'
import { notebookPage } from './config.notebook'
import setup from '../../package.json'

export { links } from './links'

export type AppNav = Navigation<
    DefaultLayout.NavLayout,
    DefaultLayout.NavHeader
>

export const navigation = async ({
    context,
}: {
    context: ContextTrait
    mountPath: string
}) => {
    return {
        name: setup.name,
        header: {
            icon: { tag: 'i', class: 'fas fa-rocket' },
        },
        layout: ({ router }) => notebookPage('home.md', router, context),
        routes: {
            // Fill here to add children pages
        },
    } as AppNav
}

export const title = 'Build Your Own Chapter: Starter Template'

// The cross link 'contribute' is referenced in the root 'src/app/links.json'
export const abstract = \`
This chapter provides a starter template to help you create and publish your own contribution to the gallery.
It demonstrates the minimal structure required for a chapter: navigation, metadata, Markdown rendering, etc.

See the <cross-link target="contribute"></cross-link> page for step-by-step instructions on how to customize it and 
share your own interactive scientific showcase
\`

`

export const templateConfigMarkdownTs = `
import { fromMarkdown } from 'mkdocs-ts'
import { resolveUrlWithFP } from '@w3nest/webpm-client'
import setup from '../../package.json'
import { navId } from './links'

export const url = (restOfPath: string) =>
    resolveUrlWithFP({
        package: setup.name,
        version: setup.version,
        path: \`assets/\${restOfPath}\`,
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

`

export const templateConfigNotebookTs = `
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

`

export const templateLinksTs = `
import setup from '../../package.json'

export const navId = setup.name.split('/')[0]
/**
 * Links are referenced in the Markdown source like:
 *
 * * \`<cross-link target="...">Foo</cross-link>\` → internal navigation inside the gallery
 * * \`<ext-link target="...">Bar</ext-link>\` → external links (docs, websites, APIs)
 * * \`<github-link target="...">Baz</github-link>\` → point directly to files in the repo
 *
 * Why?
 * - Centralizing all links here makes them reusable.
 * - It also prevents "hardcoding" links inside Markdown that could break later.
 *
 * ⚠️ Important: Links are *global*.
 * To avoid collisions, **always prefix your keys with your chapter ID**
 * (e.g. \`template.*\` if your chapter is mounted under \`template\`).
 */
export const links = {
    crossLinks: {
        // 🔗 Cross-links: jump to other pages within the same gallery instance
        // Example: for a sub-page mounted at '/sub-page' under chapter 'template',
        // the key is 'template.sub-page', and the value points to its nav ID.
        [\`\${navId}.sub-page\`]: \`@nav[\${navId}]/backend\`,
    },
    extLinks: {
        // 🌍 External links: reference third-party sites, libraries, or docs
        [\`\${navId}.mkdocs-ts\`]: '/apps/@w3nest/doc/latest',
        [\`\${navId}.reactivex\`]: 'https://reactivex.io/',
    },
    githubLinks: {
        // 🐙 GitHub links: direct references to source files for this chapter
        // Useful for contributors to quickly find where content lives.
        [\`\${navId}.repo\`]:
            'https://github.com/w3nest/gallery/tree/main/src/chapters/template',
        [\`\${navId}.home.md\`]:
            'https://github.com/w3nest/gallery/tree/main/src/chapters/template/assets/home.md',
    },
}

`
