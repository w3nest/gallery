import { Router } from 'mkdocs-ts'

export function drawBackground(elem: HTMLElement, router: Router, d3) {
    const svg = d3
        .select(elem)
        .append('svg')
        .attr('id', 'Layer_2')
        .attr('width', '100%')
        .attr('height', '90%')
        .attr('opacity', '0.95')
        .attr('viewBox', '0 -50 2705.13 3200')
        .attr('xmlns', 'http://www.w3.org/2000/svg')

    drawEarth(svg)
    drawCloud(svg, router, d3)
}

function drawCloud(svg, router: Router, d3) {
    const color = 'darkviolet' //'#00bcd4'
    const cloudColor = '#333333'
    const font = 'Roboto'
    const titleColor = 'white'
    const subtitleColor = '#cccccc'
    const groupCloud = svg.append('g')
    groupCloud
        .attr('opacity', '0')
        .transition() // Begin a transition
        .delay(500) // Wait for 1 second
        .duration(2500) // Transition duration is 1 second
        .attr('opacity', '1')
    groupCloud
        .append('path')
        .attr('fill', cloudColor)
        .attr('stroke', color)
        .attr('stroke-width', '10')
        .attr(
            'd',
            `M2705.13,1362.94c0-280.39-221.88-509.59-499.55-520.7
                  C2199.31,376.36,1819.93,0,1352.56,0S505.82,375.56,499.55,841.4
                  C221.87,852.52,0,1082.67,0,1363.07s227.43,526.82,509.95,526.82h406.53
                  c96.38,0,326.68,116.15,326.68,609.8h-184.33l290.38,356.49,290.38-356.49
                  h-178.64c0-493.65,234.42-609.8,326.68-609.8h406.53c283-.03,510.97-242.71,
                  510.97-526.97v.02Z`,
        )
        .style('filter', 'drop-shadow( 0px 0px 50px white)')

    drawLogo({ svg: groupCloud, color })
    // Add text elements
    const text = groupCloud
        .append('text')
        .attr('x', '800')
        .attr('y', '220')
        .attr('text-anchor', 'middle')
        .attr('font-family', font)
        .attr('fill', 'white')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '700')
        .attr('font-size', '200')
        .attr('font-weight', 'bold')
        .attr('fill', titleColor)
        .text('W3Nest')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '200')
        .attr('font-size', '100')
        .attr('font-style', 'italic')
        .attr('fill', subtitleColor)
        .text('Reimagine the Cloud ... On Your PC.')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '100')
        .attr('font-size', '70')
        .attr('font-style', 'italic')
        .attr('fill', subtitleColor)
        .text('Accessible. Elastic. Collaborative.')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '200')
        .attr('font-size', '70')
        .attr('font-weight', 'normal')
        .text('Harness the power of cloud technologies locally.')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '120')
        .attr('font-size', '70')
        .attr('font-weight', 'normal')
        .text('Bring back ownership and simplicity.')

    text.append('tspan')
        .attr('x', '1350')
        .attr('dy', '120')
        .attr('font-size', '70')
        .attr('font-weight', 'normal')
        .text('Create, share, and enjoy web applications.')

    const base = {
        group: groupCloud,
        color,
        cloudColor,
        router,
        font,
    }

    createButton({
        ...base,
        x: 1000,
        y: 2900,
        title: 'Start',
        onclick: () =>
            router.fireNavigateTo('?nav=/presentations/w3nest/motivations'),
        d3,
    }) /*
    createButton({
        ...base,
        x: 1400,
        y: 3000,
        title: 'Get started',
        onclick: () => router.navigateTo({ path: '/quick-start' }),
    })
        */
}
function drawLogo({ svg, color }: { svg; color: string }) {
    const defs = svg.append('defs')
    const gradient = defs
        .append('linearGradient')
        .attr('id', 'orange-to-black')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%')

    gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:darkorange;stop-opacity:1`)
    gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:orange;stop-opacity:1`)
    svg.append('g')
        .attr('transform', 'scale(200) translate(6.2, 1)')
        .append('path')
        .attr('stroke', 'violet')
        .attr('fill', color)
        .attr('stroke-width', 0.02)
        .attr(
            'd',
            'M.016.004C-.263.566-.101 1.204.1 1.157.3 1.157.416.812.45.637.409.947.465 1.428.613 1.44.908 1.446 1.391.414 1.049.396.873.406.779.672.935.765 1.14.839 1.665.488 1.381-.039 1.145-.446.686-.523.251-.405-.119-.3-.3-.115-.42.047-.668.421-.643.875-.413 1.218-.282 1.402.089 1.694.669 1.692 1.107 1.689 1.408 1.312 1.468 1.207 1.4433 1.1963 1.424 1.235 1.419 1.235 1.225 1.465 1.008 1.628.656 1.643.163 1.641-.186 1.446-.376 1.141-.601.747-.522.128-.116-.148.002-.254.609-.568 1.151-.154 1.804.353 1.051.765.979.711.882.665.896.451 1.064.469 1.26.542.843 1.395.64 1.367.469 1.359.474.751.479.616.479.589.454.548.43.618.417.679.302 1.049.127 1.094-.122 1.144-.095.368.05.012',
        )
}

function createButton({
    group,
    title,
    router,
    color,
    cloudColor,
    font,
    x,
    y,
    onclick,
    d3,
}: {
    group
    title: string
    router: Router
    color: string
    cloudColor: string
    font: string
    x: number
    y: number
    onclick: () => void
    d3: any
}) {
    const buttonGroup = group
        .append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer')
        .on('click', () => onclick())
        .on('mouseover', function () {
            d3.select(this)
                .select('rect')
                .transition()
                .duration(200)
                .attr('fill', color)
        })
        .on('mouseout', function () {
            d3.select(this)
                .select('rect')
                .transition()
                .duration(200)
                .attr('fill', cloudColor)
        })

    buttonGroup
        .append('rect')
        .attr('x', 0)
        .attr('width', 700)
        .attr('height', 150)
        .attr('fill', cloudColor)
        .attr('stroke', 'violet')
        .attr('rx', 15)
        .attr('ry', 15)

    buttonGroup
        .append('text')
        .attr('x', 350)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .attr('font-family', font)
        .attr('font-size', '80')
        .attr('fill', 'white')
        .text(title)
}

const lightsData = [
    {
        id: 'light4',
        transform: 'matrix(-.87023 .63857 .63846 .87038 25.205 -35.313)',
    },
    {
        id: 'light1',
        transform: 'matrix(-1.0458 .76725 .76725 1.0458 35.617 -22.144)',
    },
    {
        id: 'light2',
        transform: 'matrix(-.80628 .59154 .59154 .80628 12.386 -18.029)',
    },
    {
        id: 'light3',
        transform: 'matrix(-.80628 .59154 .59154 .80628 13.499 -31.5)',
    },
]
const linearGradientsData = [
    {
        id: 'gradientLink1',
        x1: '-25.176',
        x2: '-22.252',
        y1: '30.057',
        y2: '21.042',
    },
    {
        id: 'gradientLink2',
        x1: '-25.176',
        x2: '-22.114',
        y1: '30.057',
        y2: '22.662',
    },
    {
        id: 'gradientLink3',
        x1: '-22.823',
        x2: '-22.114',
        y1: '28.338',
        y2: '22.662',
    },
    {
        id: 'gradientLink4',
        x1: '-21.659',
        x2: '-21.962',
        y1: '15.649',
        y2: '21.336',
    },
]

const linkData = [
    {
        m: 'matrix(1.131 .61310 -.47656 .87914 54.091 16.044)',
        s: 'gradientLink1',
    },
    {
        m: 'matrix(.93933 -.87909 .68331 .73013 32.314 -4.4516)',
        s: 'gradientLink2',
    },
    {
        m: 'matrix(-1.2803 -.12616 .098062 -.99518 -2.4051 40.524)',
        s: 'gradientLink3',
    },
    {
        m: 'matrix(.91787 -.85898 .66770 .71343 27.633 -6.9091)',
        s: 'gradientLink4',
    },
]

const continentsData = [
    'm44.071 20.714l-0.545 0.618c-0.334-0.394-0.709-0.725-1.089-1.071l-0.836 0.123-0.764-0.863v1.068l0.654 0.495 0.436 0.494 0.582-0.658c0.146 0.274 0.291 0.548 0.436 0.823v0.822l-0.655 0.74-1.199 0.823-0.908 0.907-0.582-0.661 0.291-0.74-0.582-0.658-0.981-2.098-0.836-0.945-0.219 0.246 0.328 1.194 0.618 0.699c0.352 1.017 0.701 1.99 1.164 2.963 0.718 0 1.394-0.077 2.107-0.166v0.576l-0.872 2.139-0.8 0.904-0.654 1.401v2.303l0.219 0.906-0.364 0.41-0.8 0.494-0.836 0.699 0.691 0.782-0.945 0.824 0.182 0.533-1.418 1.606h-0.945l-0.8 0.494h-0.509v-0.659l-0.217-1.318c-0.281-0.826-0.574-1.647-0.872-2.467 0-0.605 0.036-1.205 0.072-1.81l0.364-0.823-0.509-0.988 0.037-1.357-0.692-0.782 0.346-1.13-0.563-0.639h-0.982l-0.327-0.37-0.981 0.618-0.4-0.454-0.909 0.782c-0.617-0.7-1.235-1.399-1.854-2.098l-0.726-1.729 0.654-0.986-0.363-0.411 0.799-1.894c0.656-0.816 1.341-1.599 2.035-2.385l1.236-0.329 1.381-0.165 0.945 0.248 1.345 1.356 0.473-0.534 0.653-0.082 1.236 0.411h0.946l0.654-0.576 0.291-0.411-0.655-0.412-1.091-0.082c-0.303-0.419-0.584-0.861-0.944-1.234l-0.364 0.164-0.145 1.07-0.655-0.74-0.144-0.824-0.727-0.574h-0.292l0.728 0.822-0.291 0.74-0.581 0.164 0.363-0.74-0.655-0.328-0.581-0.658-1.091 0.246-0.145 0.328-0.654 0.412-0.363 0.906-0.909 0.452-0.4-0.452h-0.436v-1.482l0.946-0.494h0.726l-0.146-0.575-0.58-0.576 0.98-0.206 0.545-0.617 0.436-0.741h0.801l-0.219-0.575 0.509-0.329v0.658l1.09 0.246 1.09-0.904 0.073-0.412 0.945-0.658c-0.342 0.043-0.684 0.074-1.018 0.165v-0.7414l0.363-0.8228h-0.363l-0.798 0.7402-0.219 0.412 0.219 0.576-0.365 0.987-0.581-0.329-0.508-0.576-0.8 0.576-0.291-1.316 1.381-0.9052v-0.4941l0.872-0.5757 1.381-0.3296 0.946 0.3296 1.744 0.3291-0.436 0.4932h-0.945l0.945 0.9877 0.727-0.8227 0.221-0.3618s2.787 2.4975 4.379 5.2305c1.593 2.733 2.341 5.955 2.341 6.609z',
    'm26.07 9.2363l-0.073 0.4932 0.51 0.3295 0.871-0.5761-0.436-0.4937-0.582 0.3296-0.29-0.0825',
    'm26.87 5.8633l-1.89-0.7407-2.18 0.2466-2.691 0.7402-0.508 0.4941 1.671 1.1514v0.6582l-0.654 0.6582 0.873 1.7287 0.58-0.33 0.729-1.1512c1.123-0.3472 2.13-0.7407 3.197-1.2344l0.873-2.2212',
    'm28.833 12.775l-0.291-0.741-0.51 0.165 0.147 0.904 0.654-0.328',
    'm29.123 12.609l-0.145 0.988 0.799-0.165 0.581-0.575-0.508-0.494c-0.171-0.455-0.368-0.88-0.582-1.317h-0.435v0.494l0.29 0.329v0.74',
    'm18.365 28.242l-0.582-1.152-1.09-0.247-0.582-1.562-1.453 0.164-1.236-0.904-1.309 1.151v0.182c-0.396-0.115-0.883-0.13-1.235-0.347l-0.291-0.822v-0.906l-0.8722 0.082c0.0728-0.576 0.145-1.151 0.2183-1.727h-0.5093l-0.5083 0.658-0.5093 0.246-0.7271-0.41-0.0728-0.905 0.1455-0.988 1.0908-0.822h0.8721l0.145-0.494 1.0903 0.246 0.8 0.988 0.145-1.646 1.382-1.152 0.508-1.234 1.018-0.411 0.581-0.822 1.309-0.248 0.654-0.987h-1.963l1.236-0.576h0.872l1.236-0.412 0.146-0.492-0.437-0.412-0.509-0.165 0.146-0.494-0.363-0.74-0.873 0.328 0.146-0.657-1.018-0.5765-0.799 1.3975 0.072 0.494-0.799 0.331-0.51 1.069-0.218-0.987-1.381-0.577-0.218-0.74 1.817-1.0701 0.8-0.7402 0.073-0.9048-0.436-0.2471-0.582-0.0825-0.363 0.9053s-0.608 0.1191-0.764 0.1577c-1.996 1.8397-6.0294 5.8097-6.9664 13.306 0.0371 0.174 0.6792 1.182 0.6792 1.182l1.5264 0.904 1.5264 0.412 0.6544 0.824 1.018 0.74 0.581-0.082 0.436 0.196v0.133l-0.581 1.563-0.437 0.658 0.146 0.33-0.363 1.233 1.308 2.386 1.308 1.153 0.582 0.822-0.073 1.728 0.437 0.987-0.437 1.892s-0.034-0.011 0.022 0.178c0.056 0.19 2.329 1.451 2.473 1.344 0.144-0.109 0.267-0.205 0.267-0.205l-0.145-0.41 0.581-0.577 0.219-0.576 0.945-0.33 0.727-1.81-0.218-0.493 0.508-0.74 1.09-0.248 0.582-1.316-0.145-1.645 0.872-1.234 0.145-1.235c-1.193-0.591-2.376-1.201-3.561-1.81',
    'm16.766 9.5649l0.726 0.4941h0.582v-0.5761l-0.726-0.3291-0.582 0.4111',
    'm14.876 8.9072l-0.364 0.9048h0.727l0.364-0.8228c0.314-0.2217 0.626-0.4448 0.945-0.6582l0.727 0.2471c0.484 0.3291 0.969 0.6582 1.454 0.9868l0.727-0.6577-0.8-0.3291-0.364-0.7407-1.381-0.1646-0.073-0.4116-0.654 0.165-0.29 0.5758-0.364-0.7407-0.145 0.3291 0.073 0.8228-0.582 0.494',
    'm17.492 6.8496l0.364-0.3286 0.727-0.1646c0.498-0.2422 0.998-0.4053 1.527-0.5762l-0.29-0.4937-0.939 0.1348-0.443 0.4419-0.731 0.106-0.65 0.3052-0.316 0.1528-0.193 0.2583 0.944 0.1641',
    'm18.728 14.666l0.437-0.658-0.655-0.493 0.218 1.151',
]

export function drawEarth(svg) {
    // Define gradients
    const defs = svg.append('defs')
    const gradient = defs
        .append('linearGradient')
        .attr('id', 'linearGradient6001')
    gradient.append('stop').attr('offset', '0').attr('stop-color', '#fff')
    gradient
        .append('stop')
        .attr('offset', '1')
        .attr('stop-color', '#fff')
        .attr('stop-opacity', '0')

    defs.append('radialGradient')
        .attr('id', 'radialGradientOuterAtmosphere')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('cx', '18.248')
        .attr('cy', '15.716')
        .attr('r', '29.993')
        .selectAll('stop')
        .data([
            { offset: '0', color: '#d3e9ff' },
            { offset: '.15517', color: '#d3e9ff' },
            { offset: '.75', color: '#4074ae' },
            { offset: '1', color: '#36486c' },
        ])
        .enter()
        .append('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color)

    defs.append('radialGradient')
        .attr('id', 'radialGradientInnerAtmosphere')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('cx', '15.601')
        .attr('cy', '12.142')
        .attr('r', '43.527')
        .selectAll('stop')
        .data([
            { offset: '0', color: '#fff' },
            { offset: '1', color: '#fff', opacity: '.16495' },
        ])
        .enter()
        .append('stop')
        .attr('offset', (d) => d.offset)
        .attr('stop-color', (d) => d.color)
        .attr('stop-opacity', (d) => d.opacity)

    defs.selectAll()
        .data([0, 1, 2, 3, 4])
        .enter()
        .append('radialGradient')
        .attr('id', (i) => `radialGradientLight${i}`)
        .attr('cx', '12.071')
        .attr('cy', '12.493')
        .attr('r', '0')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('href', '#linearGradient6001')
        .transition() // Begin a transition
        .delay((i) => (i + 0.5) * 500) // Wait for 1 second
        .duration(1000) // Transition duration is 1 second
        .attr('r', '6.7175')

    defs.selectAll('.linearGradient')
        .data(linearGradientsData)
        .enter()
        .append('linearGradient')
        .attr('id', ({ id }) => `linearGradient${id}`)
        .attr('x1', ({ x1 }) => x1)
        .attr('x2', ({ x2 }) => x2)
        .attr('y1', ({ y1 }) => y1)
        .attr('y2', ({ y2 }) => y2)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('xlink:href', '#linearGradient6001')

    // Append main <g> container
    const mainGroup = svg
        .append('g')
        .attr('id', 'layer1')
        .attr('transform', 'scale(75) translate(-6.5,-4)')

    // Outer atmosphere
    mainGroup
        .append('g')
        .attr('id', 'outer-atmosphere')
        .append('path')
        .attr('id', 'path3214')
        .attr('stroke', '#39396c')
        .attr('fill', 'url(#radialGradientOuterAtmosphere)')
        .attr(
            'd',
            'm43.96 23.485c0 10.71-8.682 19.392-19.39 19.392-10.71 0-19.391-8.682-19.391-19.392-0.0003-10.709 8.681-19.39 19.391-19.39 10.708 0.0002 19.39 8.681 19.39 19.39z',
        )

    // Continents
    mainGroup
        .append('g')
        .attr('id', 'continents')
        .attr('transform', 'matrix(.98237 0 0 .98237 .12108 .23291)')
        .attr('fill', '#204a87')
        .attr('fill-opacity', '.71345')
        .selectAll('.continents')
        .data(continentsData)
        .enter()
        .append('path')
        .attr('d', (d) => d)

    mainGroup
        .append('path')
        .attr('id', 'inner-atmosphere')
        .attr('opacity', '.3956')
        .attr('stroke', 'url(#radialGradientInnerAtmosphere)')
        .attr('fill', 'none')
        .attr(
            'd',
            'm42.975 23.486c0 10.165-8.241 18.406-18.406 18.406s-18.406-8.241-18.406-18.406c0.0004-10.166 8.241-18.406 18.406-18.406 10.165-0.0001 18.406 8.24 18.406 18.406z',
        )

    // Link1
    mainGroup
        .selectAll('.link')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', '.link')
        .attr('stroke-linejoin', 'round')
        .attr('style', 'color:#000000')
        .attr(
            'd',
            'm-2.8284 21.042a15.733 9.4576 0 1 1 -31.467 0 15.733 9.4576 0 1 1 31.467 0z',
        )
        .attr('transform', ({ m }) => m)
        .attr('stroke', ({ s }) => `url(#linearGradient${s})`)
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', '.88164')
        .attr('fill', 'none')

    lightsData.forEach((data, i) => createLightGroup(mainGroup, data, i))
}

function createLightGroup(selection, data, i) {
    const group = selection
        .append('g')
        .attr('id', data.id)
        .attr('transform', data.transform)
        .attr('fill-rule', 'evenodd')

    // Add the first path
    group
        .append('path')
        .attr('id', `${data.id}-path1`)
        .attr('style', 'color:#000000')
        .attr('transform', 'translate(14.95 22.93)')
        .attr('fill', `url(#radialGradientLight${i})`)
        .attr(
            'd',
            'm18.789 12.493a6.7175 6.7175 0 1 1 -13.435 0 6.7175 6.7175 0 1 1 13.435 0z',
        )

    // Add the second path
    group
        .append('circle')
        .attr('id', `${data.id}-path2`)
        .attr('style', 'color:#000000')
        .attr('transform', 'matrix(.30827 0 0 .30827 27 35.5)')
        .attr('fill', '#fff')
        .attr('r', '0')
        .attr(
            'd',
            'm18.789 12.493a6.7175 6.7175 0 1 1 -13.435 0 6.7175 6.7175 0 1 1 13.435 0z',
        )
        .transition() // Begin a transition
        .delay((i + 0.5) * 500) // Wait for 1 second
        .duration(1000) // Transition duration is 1 second
        .attr('r', '6')
}
