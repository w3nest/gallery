import { ContextTrait, DefaultLayout, parseMd, Router } from 'mkdocs-ts'
import { DisplayFactory, Views, NotebookPage } from '@mkdocs-ts/notebook'
import {
    Immutable,
    Modules,
    HtmlTrait,
    Deployers,
    Projects,
} from '@vs-flow/core'

import pkgJson from '../../package.json'

import type * as Journal from '@vs-flow/core/Journal'
import { placeholders, url } from './config.markdown'
import { child$ } from 'rx-vdom'
import { from } from 'rxjs'
import * as webpm from '@w3nest/webpm-client'

import { Renderer3DView } from '@vs-flow/flowchart-3d'
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

export class FlowChartState {
    public readonly router: Router

    constructor(params: { router: Router }) {
        Object.assign(this, params)
    }
    select() {}
    displayModuleView(
        module: Immutable<Modules.ImplementationTrait & HtmlTrait>,
    ) {
        DefaultLayout.popupModal({
            content: module.html(),
        })
    }
    displayModuleJournal(module: Immutable<Modules.ImplementationTrait>) {
        DefaultLayout.popupModal({
            content: {
                tag: 'div',
                class: 'mkdocs-bg-0 mkdocs-text-0 w-100 h-100 overflow-auto p-2',
                children: [
                    child$({
                        source$: from(
                            webpm.install<{ Journal: typeof Journal }>({
                                esm: [
                                    `@vs-flow/core/Journal#${pkgJson.version} as Journal`,
                                ],
                            }),
                        ),
                        vdomMap: ({ Journal }) => {
                            const state = new Journal.State({
                                journal: module.journal as any,
                            })
                            return new Journal.View({
                                title: `🧾 ${module.uid}`,
                                subtitle: `ToolBox: \`${module.toolboxId}\` , Type: \`${module.typeId.split('.').slice(-1)[0]}\``,
                                state,
                            })
                        },
                        untilFirst: {
                            tag: 'div',
                            class: 'fas fa-spinner fa-spin m-3',
                        },
                    }),
                ],
            },
        })
    }
    displayModuleDocumentation(module: Immutable<Modules.ImplementationTrait>) {
        if (!this.router) {
            return
        }
        const tbId = module.toolboxId
        const tb = module.environment.toolboxes.find((t) => t.uid === tbId)
        if (!tb) {
            return
        }
        //const tbId = tb.origin.packageName
        const inDoc = {
            '@vs-flow/tb-rxjs': 'tb-rxjs',
            '@vs-flow/tb-three-js': 'tb-three-js',
            '@vs-flow/tb-pmp': 'tb-pmp',
            '@vs-flow/tb-tweakpane': 'tb-tweakpane',
            '@vs-flow/tb-rx-vdom': 'tb-rx-vdom',
            '@vs-flow/tb-debug': 'tb-debug',
        }
        if (tb.origin.packageName in inDoc) {
            const typeId = module.typeId.split('.').slice(-1)[0]
            const docId = inDoc[tb.origin.packageName as keyof typeof inDoc]
            this.router.fireNavigateTo(`nav=/api/toolboxes/${docId}/${typeId}`)
            return
        }
        const url = module.factory.declaration.documentation
        if (url) {
            window.open(url, '_blank')
        }
    }

    displayWorkerEnvironment(
        workerEnv: Immutable<Deployers.WorkerEnvironmentTrait>,
    ) {}
}

export const displayVsfProject = (router?: Router) => ({
    name: 'vsfProject',
    isCompatible: (elem: any) => {
        return elem.main !== undefined && elem.environment !== undefined
    },
    view: (project: Immutable<Projects.ProjectState>) => {
        const flowchart = new Renderer3DView({
            project,
            workflowId: 'main',
            state: new FlowChartState({ router }),
        })
        return Views.Layouts.viewPortOnly({
            content: Views.Layouts.single({
                content: flowchart,
            }),
        })
    },
})
export const notebookPage = async (
    target: string,
    router: Router,
    context: ContextTrait,
) => {
    const displayFactory: DisplayFactory = [displayVsfProject(router)]
    return new NotebookPage(
        {
            url: url(target),
            router,
            options: notebookOptions,
            displayFactory,
            initialScope: {
                const: {
                    BASE_URL: webpm.getUrlBase(pkgJson.name, pkgJson.version),
                },
                let: {},
            },
        },
        context,
    )
}
