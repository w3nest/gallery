import { ChildrenLike, VirtualDOM } from 'rx-vdom'

export class ExtLink implements VirtualDOM<'a'> {
    public readonly tag = 'a'
    public readonly children: ChildrenLike
    public readonly innerText: string
    public readonly href: string
    public readonly target = '_blank'

    constructor(elem: HTMLElement) {
        const target = elem.getAttribute('target')
        if (!target) {
            return
        }
        const navs = {
            w3nest: '/apps/@w3nest/doc/latest',
            w3lab: '/w3lab',
            'w3nest-gallery': '/apps/@w3nest/gallery/latest',
            chartjs: 'https://www.chartjs.org/',
            three: 'https://threejs.org/',
            pyodide: 'https://pyodide.org/en/stable/',
            'pyodide-packages':
                'https://pyodide.org/en/stable/usage/packages-in-pyodide.html',
            matplotlib: 'https://matplotlib.org/',
            'rx-vdom': '/apps/@rx-vdom/doc/latest',
            'virtual-dom': '/apps/@rx-vdom/doc/latest?nav=/api.VirtualDOM',
            webpm: '/apps/@webpm-client/doc/latest',
            'floating-ui': 'https://floating-ui.com/',
        }
        if (!(target in navs)) {
            return
        }
        this.href = navs[target as keyof typeof navs]
        this.children = [
            {
                tag: 'i',
                innerText: elem.textContent ?? '',
            },
            {
                tag: 'i',
                class: 'fas fa-external-link-alt',
                style: { transform: 'scale(0.6)' },
            },
        ]
    }
}

export class GitHubLink implements VirtualDOM<'a'> {
    public readonly tag = 'a'
    public readonly children: ChildrenLike
    public readonly innerText: string
    public readonly href: string
    public readonly target = '_blank'

    constructor(elem: HTMLElement) {
        const target = elem.getAttribute('target')

        if (!target) {
            return
        }
        const navs = {
            'presentations.w3nest.demo.md':
                'https://github.com/w3nest/gallery/blob/main/assets/presentations.w3nest.demo.md?raw=1',
            'mkdocs-ts': 'https://github.com/w3nest/mkdocs-ts',
        }
        if (!(target in navs)) {
            return
        }
        this.href = navs[target as keyof typeof navs]
        this.children = [
            {
                tag: 'i',
                innerText: elem.textContent ?? '',
            },
            {
                tag: 'i',
                class: 'fab fa-github',
                style: { transform: 'scale(0.8)' },
            },
        ]
    }
}

export class CrossLink implements VirtualDOM<'a'> {
    public readonly tag = 'a'
    public readonly children: ChildrenLike
    public readonly innerText: string
    public readonly href: string

    constructor(elem: HTMLElement) {
        const target = elem.getAttribute('target')
        if (!target) {
            return
        }
        const navs = {
            'tdse-1d': '@nav/sciences/tdse-1d',
        }
        if (!(target in navs)) {
            return
        }
        this.href = navs[target as keyof typeof navs]
        this.children = [
            {
                tag: 'i',
                innerText: elem.textContent ?? '',
            },
            {
                tag: 'i',
                class: 'fas fa-book-open',
                style: { transform: 'scale(0.6)' },
            },
        ]
    }
}
