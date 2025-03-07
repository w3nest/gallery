import { fromMd } from '../config.markdown'
import { AppNav } from '../navigation'

import { navigation as quantumQuemNav } from './quantum-chem'
import { navigation as tse1dNav } from './tdse-1d'

export const navigation: AppNav = {
    name: 'Sciences',
    header: {
        icon: { tag: 'div', class: 'fas fa-atom' },
    },
    layout: fromMd('sciences.md'),
    routes: {
        '/quantum-chem': quantumQuemNav,
        '/tdse-1d': tse1dNav,
    },
}
