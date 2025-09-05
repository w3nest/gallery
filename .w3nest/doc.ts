import { generateApiFiles } from '../node_modules/@mkdocs-ts/code-api/src/mkapi-backends/mkapi-typescript'

const externals: any = {
    'rx-vdom': ({ name }: { name: string }) => {
        if (!name) {
            return '/apps/@rx-vdom/doc/latest'
        }
        return `/apps/@rx-vdom/doc/latest?nav=/api.${name}`
    },
    typescript: ({ name }: { name: string }) => {
        const urls = {
            Promise:
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
            HTMLElement:
                'https://www.typescriptlang.org/docs/handbook/dom-manipulation.html',
            Record: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
            Pick: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
            MouseEvent:
                'https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent',
            Partial:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
            Omit: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys',
            window: 'https://developer.mozilla.org/en-US/docs/Web/API/Window',
            HTMLHeadingElement:
                'https://developer.mozilla.org/en-US/docs/Web/API/HTMLHeadingElement',
            Set: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
            ClassMethodDecoratorContext:
                'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html',
            DOMRect: 'https://developer.mozilla.org/en-US/docs/Web/API/DOMRect',
            ScrollToOptions:
                'https://developer.mozilla.org/fr/docs/Web/API/Window/scrollTo',
            Exclude:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers',
            Error: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
            Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
            ReadonlyMap:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
            WeakMap:
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap',
            ReadonlySet:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
            WeakSet:
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet',
            Parameters:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype',
            ReturnType:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype',
            Readonly:
                'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
        }
        if (!(name in urls)) {
            console.warn(`Can not find URL for typescript's '${name}' symbol`)
        }
        return urls[name]
    },
    rxjs: ({ name }: { name: string }) => {
        const urls = {
            Subject: 'https://www.learnrxjs.io/learn-rxjs/subjects/subject',
            BehaviorSubject:
                'https://www.learnrxjs.io/learn-rxjs/subjects/subject',
            ReplaySubject:
                'https://www.learnrxjs.io/learn-rxjs/subjects/replaysubject',
            Observable: 'https://rxjs.dev/guide/observable',
            combineLatest: 'https://rxjs.dev/api/index/function/combineLatest',
            withLatestFrom:
                'https://rxjs.dev/api/index/function/withLatestFrom',
            zip: 'https://rxjs.dev/api/index/function/zip',
            from: 'https://www.learnrxjs.io/learn-rxjs/operators/creation/from',
        }
        if (!(name in urls)) {
            console.warn(`Can not find URL for rxjs's '${name}' symbol`)
        }
        return urls[name]
    },
    'mkdocs-ts': ({ name }: { name: string }) => {
        const baseUrl = 'https://w3nest.org/apps/@mkdocs-ts/doc/latest?nav=/api'
        const urls = {
            Navigation: `${baseUrl}/mkdocs-ts.Navigation`,
            'DefaultLayout.NavLayout': `${baseUrl}/mkdocs-ts/DefaultLayout.NavLayout`,
            'DefaultLayout.NavHeader': `${baseUrl}/mkdocs-ts/DefaultLayout.NavHeader`,
            ContextTrait: `${baseUrl}/mkdocs-ts.ContextTrait`,
        }
        if (!(name in urls)) {
            console.warn(`Can not find URL for mkdocs-ts's '${name}' symbol`)
        }
        return urls[name]
    },
}

generateApiFiles({
    projectFolder: `${__dirname}/..`,
    outputFolder: `${__dirname}/../assets/api`,
    externals,
})
