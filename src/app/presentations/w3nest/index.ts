import { AppNav } from '../../navigation'
import { fromMd } from '../../config.markdown'
import { notebookPage } from '../../config.notebook'
import { WelcomeScreen } from './welcome-screen'
import { install } from '@w3nest/webpm-client'

export const navigation: AppNav = {
    name: 'W3Nest',
    layout: {
        content: ({ router }) => {
            return install({ esm: ['d3#^7.0.0 as d3'] }).then(
                (scope) => new WelcomeScreen({ router, d3: (scope as any).d3 }),
            )
        },
        toc: 'disabled',
    },
    routes: {
        '/motivations': {
            name: 'Motivations',
            layout: fromMd('presentations.w3nest.motivations.md'),
        },
        '/usual-clouds': {
            name: 'Usual Clouds',
            layout: fromMd('presentations.w3nest.usual-clouds.md'),
        },
        '/solution': {
            name: 'Solution',
            layout: fromMd('presentations.w3nest.solution.md'),
        },
        '/demo': {
            name: 'Demo',
            layout: ({ router }) =>
                notebookPage('presentations.w3nest.demo.md', router),
        },
        '/features': {
            name: 'Features',
            layout: ({ router }) =>
                notebookPage('presentations.w3nest.features.md', router),
        },
        '/highlights': {
            name: 'Highlights',
            layout: ({ router }) =>
                notebookPage('presentations.w3nest.highlights.md', router),
        },
    },
}
