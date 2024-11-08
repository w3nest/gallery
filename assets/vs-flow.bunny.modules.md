# Modules

This page defines custom modules that are used within the re-meshing application.

<js-cell>
if(!window['rxjs'] || !window['@youwol/vsf-core']){
    await webpm.install({esm:['@youwol/vsf-core#^0.3.1 as VSF']})
}
const rxjs = window['rxjs']
const vsf = window['@youwol/vsf-core']
</js-cell>
## Controls

<js-cell>
class State{
    constructor(){
        this.value$ = new rxjs.BehaviorSubject(1)
    }
}
const moduleControls = new vsf.Modules.Module({
    declaration: {
        typeId: 'control'
    },
    implementation: ({fwdParams}) => {
        const state = new State()
        return new vsf.Modules.Implementation(
            {
                // we could provide min & max here in configuration
                configuration: {schema: {}},
                inputs: {},
                outputs: (arg) => ({
                    value$: arg.state.value$.pipe(
                        rxjs.operators.map( (v) => ({data: v, context:{}}))
                    )
                }),
                html: () => {
                    return { 
                        tag: 'div',
                        class: 'w-100 d-flex align-items-center',
                        children: [
                            {   class: 'fas fa-tachometer-alt' },
                            {	class:'mx-2' },
                            {
                                tag: 'input', type: 'range', min: 100, max:1000,  
                                class:'flex-grow-1',
                                value: {source$:state.value$, vdomMap: (v) => v * 1000},
                                onchange: (ev) => state.value$.next(ev.target.value / 1000)
                            },                                
                            {	class:'mx-1' },
                            {
                                tag: 'input', type: 'number', 
                                class: 'w-25',
                                value: state.value$,
                                onchange: (ev) => state.value$.next(ev.target.value)
                            }
                        ] 
                    }
                },
                state,
            },
            fwdParams,
        )
    }
})

</js-cell>