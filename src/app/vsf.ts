import {
    Deployers,
    HtmlTrait,
    Immutable,
    Immutables,
    Modules,
    Projects,
    Workflows,
} from '@youwol/vsf-core'
import type { NotebookTypes } from '@youwol/mkdocs-ts'
import { Views } from '@youwol/mkdocs-ts'
import { AnyVirtualDOM, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { install } from '@youwol/webpm-client'
import { BehaviorSubject, from } from 'rxjs'
import type { StateTrait, Selectable } from '@youwol/vsf-canvas'

class VsfCanvasState implements StateTrait {
    select(_entities: Immutables<Selectable>) {}
    displayModuleView(
        module: Immutable<Modules.ImplementationTrait & HtmlTrait>,
    ) {
        Views.popupModal({
            content: module.html(),
            maxWidth: '50%',
            maxHeight: '50%',
        })
    }
    displayModuleJournal(_module: Immutable<Modules.ImplementationTrait>) {}
    displayModuleDocumentation(
        _module: Immutable<Modules.ImplementationTrait>,
    ) {}
    displayWorkerEnvironment(
        _workerEnv: Immutable<Deployers.WorkerEnvironmentTrait>,
    ) {}
}
export function getWfId(
    project: Projects.ProjectState,
    workflow: Workflows.WorkflowModel,
) {
    if (workflow === project.main) {
        return 'main'
    }
    return workflow.uid
}

function isElementInViewport(element, name, s$) {
    let isVisible = false

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log('IN view port', name, entries)
                isVisible = true
                s$.next(true)
            } else {
                console.log('OUT of view port', name, entries)
                isVisible = false
                s$.next(false)
            }
        })
    })

    observer.observe(element)

    return isVisible
}

export function displayVsfWorkflow(
    project: Projects.ProjectState,
    workflowId: string,
): AnyVirtualDOM {
    return {
        tag: 'div',
        class: 'w-100 fv-text-primary',
        style: {
            aspectRatio: '1/1',
            maxHeight: '100%',
        },
        children: [
            {
                source$: from(
                    install({
                        modules: ['@youwol/vsf-canvas#^0.3.0 as Canvas'],
                        css: [
                            '@youwol/fv-widgets#latest~dist/assets/styles/style.youwol.css',
                        ],
                    }),
                ),
                vdomMap: ({ Canvas }) => {
                    const isInViewPort$ = new BehaviorSubject(false)
                    return {
                        tag: 'div',
                        class: 'w-100 h-100',
                        connectedCallback: (elem) => {
                            isElementInViewport(
                                elem,
                                'FlowChart 3D',
                                isInViewPort$,
                            )
                        },
                        children: [
                            {
                                source$: isInViewPort$,
                                vdomMap: (inVP) =>
                                    inVP
                                        ? new DagView({
                                              project,
                                              Canvas,
                                              workflowId,
                                          })
                                        : { tag: 'div' },
                            },
                        ],
                    }
                },
            },
        ],
    }
}

export class DagView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'w-100 h-100 d-flex flex-column'
    public readonly children: ChildrenLike
    constructor({ project, workflowId, Canvas }) {
        const project$ = new BehaviorSubject(project)
        const loading$ = new BehaviorSubject(false)
        const dag3D = new Canvas.Renderer3DView({
            project$,
            workflowId,
            state: new VsfCanvasState(),
        })
        this.children = [
            {
                tag: 'div',
                class: 'w-100 mkdocs-text-0 mkdocs-bg-0 d-flex justify-content-center',
                children: [
                    {
                        tag: 'i',
                        class: {
                            source$: loading$,
                            vdomMap: (l) =>
                                l ? 'fa-spin fa-spinner' : 'fa-sync fv-pointer',
                            wrapper: (d) => `fas ${d}`,
                        },
                        onclick: () => {
                            loading$.next(true)
                            project.clone().then((clone) => {
                                project$.next(clone)
                                loading$.next(false)
                            })
                        },
                    },
                ],
            },
            dag3D,
        ]
    }
}
export const displayFactory: NotebookTypes.DisplayFactory = [
    {
        name: 'VSF-project',
        isCompatible: (d: unknown) => {
            return (
                ['main', 'environment', 'instancePool', 'worksheets', 'macros']
                    .map((key) => d[key])
                    .filter((v) => v === undefined).length === 0
            )
        },
        view: (project: Projects.ProjectState) => {
            return displayVsfWorkflow(project, 'main')
        },
    },
    {
        name: 'VSF-Workflow',
        isCompatible: (d: unknown) => {
            if (d['project'] === undefined || d['wf'] === undefined) {
                return false
            }
            return true
        },
        view: (d: { project: Projects.ProjectState; wf: string }) => {
            return displayVsfWorkflow(d.project, d.wf)
        },
    },
]
