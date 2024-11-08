# Remeshing macro

<js-cell>
if(!window['rxjs'] || !window['@youwol/vsf-core']){
    await webpm.install({esm:['@youwol/vsf-core#^0.3.1 as VSF']})
}
const rxjs = window['rxjs']
const vsf = window['@youwol/vsf-core']
</js-cell>

<js-cell>
const macroRemeshGeoms = {
    typeId: 'remeshGeoms',
    workflow: {
        branches:[`(mergeMap#stream)>>(fromThree#from)>>(mergeMap#merge)>>(toThree#to)>>(reduce#reduce)`],
        configurations:{
            stream: {
                project: ({data, context}) =>
                    rxjs.from(data).pipe(
                        rxjs.operators.map((d) => ({data, context}))
                    )
            },
            merge: {
                project: ({data, context, scope}) => ({
                    workflow: { 
                        branches:['(uniformRemeshing#remesh)'],
                        configurations: {                    
                            remesh: { 
                                workersPoolId: 'A',
                                edgeFactor: scope.configuration.edgeFactor
                            }
                        }
                    },
                    input:"0(#remesh)",
                    output: "(#remesh)0",
                    message: {data},
                    purgeOnDone: true,
               })
            },
            reduce:{
                accumulator: (acc, {data}) => [...acc, data], 
                seed: []
            },
        }
    },
    api:{
        inputs:['0(#stream)'],
        outputs: ['(#reduce)0'],
        configuration: {
            schema:{
                edgeFactor: new vsf.Configurations.Float({value:1})
            },
            mapper: (config)=> ({
                edgeFactor: config.edgeFactor,
            })
        }
    }
}
</js-cell>

After executing the previous cell, the macro can be inspected by selecting
`remeshGeoms` from the `macros` node of the **Project** explorer.

Key points of this macro are:
*  the `stream` module emit one by one each geometry from the incoming geometries
*  the `from` and `to` modules are the converters already discussed
*  the `merge` module orchestrate the parallel computations using the
   <a href='https://rxjs.dev/api/operators/mergeMap'> merge map</a> policy:
   the result of the computations are all emitted whenever they get available.
*  the `remesh` module (of the inner workflow) is configured such that:
   (i) it is running in the workers pool A, and (ii) the `edgeFactor` value is retrieved
   from the macro's configuration (using `scope.configuration.edgeFactor`).
*  the `reduce` module gather all the results (remeshed geometries) in an array.

<note level='hint'>
The `mergeMap` module utilized in the example serves as an orchestrator
for parallel computations. In this scenario, all computations are initiated
as soon as possible, and their results are collected in the order of
completion. There are alternative modules with distinct policies, such as:
*  The `switchMap` module operates one computation at a time, disregarding
   any ongoing computations from previous requests.
*  The `concatMap` module carries out all computations, akin to `mergeMap`,
   but maintains the order of result collection.
</note>