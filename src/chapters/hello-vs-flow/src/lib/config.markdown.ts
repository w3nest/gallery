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
    '{{tb-rxjs}}':
        "'🔀': '@vs-flow/tb-rxjs#^0.4.0', // modules for data-flow management",
    '{{tb-three-js}}':
        "'💎': '@vs-flow/tb-three-js#^0.4.0', // modules for 3D rendering",
    '{{tb-pmp}}':
        "'⚒️': '@vs-flow/tb-pmp#^0.4.0', // modules for remeshing & smoothing",
    '{{tb-rx-vdom}}':
        "'👁️': '@vs-flow/tb-rx-vdom#^0.4.0', // modules for custom views",
    '{{tb-tweakpane}}':
        "'🎛️': '@vs-flow/tb-tweakpane#^0.4.0', // modules for settings panels",
    '{{tb-debug}}':
        "'🐞': '@vs-flow/tb-debug#^0.4.0',  // modules for debugging",
}

export function fromMd(file: string) {
    return fromMarkdown({
        url: url(file),
        placeholders,
    })
}

IconFactory.register({
    vsf: {
        tag: 'img',
        style: {
            height: '1.5em',
        },
        src: getUrlBase(setup.name, setup.version) + '/assets/logo.png',
    },
})
