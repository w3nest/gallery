
const runTimeDependencies = {
    "externals": {
        "@youwol/mkdocs-ts": "^0.6.2",
        "@youwol/rx-vdom": "^1.0.1",
        "@youwol/vsf-core": "^0.3.1",
        "@youwol/webpm-client": "^3.0.0",
        "mathjax": "^3.1.4",
        "rxjs": "^7.5.6"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/mkdocs-ts": "window['@youwol/mkdocs-ts_APIv06']",
    "@youwol/rx-vdom": "window['@youwol/rx-vdom_APIv1']",
    "@youwol/vsf-core": "window['@youwol/vsf-core_APIv03']",
    "@youwol/webpm-client": "window['@youwol/webpm-client_APIv3']",
    "mathjax": "window['mathjax_APIv3']",
    "rxjs": "window['rxjs_APIv7']"
}
const exportedSymbols = {
    "@youwol/mkdocs-ts": {
        "apiKey": "06",
        "exportedSymbol": "@youwol/mkdocs-ts"
    },
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    },
    "@youwol/vsf-core": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/vsf-core"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    },
    "mathjax": {
        "apiKey": "3",
        "exportedSymbol": "mathjax"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./main.ts",
    "loadDependencies": [
        "rxjs",
        "@youwol/rx-vdom",
        "@youwol/mkdocs-ts",
        "@youwol/webpm-client",
        "mathjax",
        "@youwol/vsf-core"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {}

const entries = {
     '@youwol/gallery': './main.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/gallery/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/gallery',
        assetId:'QHlvdXdvbC9nYWxsZXJ5',
    version:'0.1.0-wip',
    shortDescription:"Youwol's gallery.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/gallery&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/gallery',
    sourceGithub:'https://github.com/youwol/gallery',
    userGuide:'https://l.youwol.com/doc/@youwol/gallery',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/gallery_APIv01`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/gallery#0.1.0-wip~dist/@youwol/gallery/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/gallery/${entry.name}_APIv01`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
