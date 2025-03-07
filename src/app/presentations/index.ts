import { fromMd } from '../config.markdown'
import { AppNav } from '../navigation'
import { navigation as W3NestNav } from './w3nest'

export const navigation: AppNav = {
    name: 'Presentations',
    header: {
        icon: { tag: 'div', class: 'fas fa-file-powerpoint' },
    },
    layout: fromMd('presentations.md'),
    routes: {
        '/w3nest': W3NestNav,
    },
}
