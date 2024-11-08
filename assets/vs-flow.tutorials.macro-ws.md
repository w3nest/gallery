
# Macros and Worksheets

Macro defines independent workflows that can be instantiated within the main project.


<note level="warning" label="Important">
Macros are a cornerstone of VS-Flow projects. They provide a mechanism for 
encapsulating blocks of logic that can be employed in multiple contexts, 
much like the role fulfilled by functions in traditional software development.
</note>

Let's define a macro that:
*  Take a date as input.
*  Output the number of seconds elapsed since EPOCH.
*  Display a simple view

<js-cell>
/*
project = await project.with({
    macros:[{
        typeId:'EPOCH',
        workflow:{
            branches:[
                `(map#epoch)>>(view#epochView)`, 
            ],
            configurations:{ 
                epoch: { 
                    project: ({data}) => ({data:Math.floor(data / 1000)})
                },
                epochView: { 
                     vdomMap: (data) => ({
                         tag: 'div',
                         innerText: `Epoch(s): ${data}`
                     }),
                }
            }
        },
        api:{
            inputs:['0(#epoch)'],
            outputs: ['(#epoch)0']
        },
        html: ({instancePool}) => ({
            tag:'div',
            class: 'd-flex rounded p-2',
            children: [
                instancePool.get('epochView').html()
            ]
        })
    }],
    workflow:{
        branches: [
            '(#date)>>(EPOCH#macro)>>(console#console)'
        ],
    }
})
*/
</js-cell>
