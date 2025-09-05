require('./style.css')
export {}
import { install, LoadingScreen } from '@w3nest/webpm-client'

import pkgJson from '../../package.json'
const loadingScreen = new LoadingScreen({
    name: pkgJson.name,
    description: pkgJson.description,
    logo: '../assets/favicon.png',
})

const mkdocsVersion = pkgJson.webpm.dependencies['mkdocs-ts']
const notebookVersion = pkgJson.webpm.dependencies['@mkdocs-ts/notebook']
await install({
    esm: [`${pkgJson.name}#${pkgJson.version}`],
    css: [
        'bootstrap#5.3.3~bootstrap.min.css',
        'fontawesome#5.12.1~css/all.min.css',
        `mkdocs-ts#${mkdocsVersion}~assets/mkdocs-light.css`,
        `@mkdocs-ts/notebook#${notebookVersion}~assets/notebook.css`,
    ],
    onEvent: (ev) => {
        loadingScreen.next(ev)
    },
})
await import('./on-load')
loadingScreen.done()
