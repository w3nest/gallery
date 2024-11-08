# Utilities

This page factorizes utilities regarding the remeshing application. 


## 3D

### Mesh display


In this project, there will be a recurring need to transform a Geometry into objects
that can be visualized in a 3D viewer.
To facilitate the reuse of a portion of a workflow in various locations,
VS-Flow introduces the concept of **macro**.

> Macros are a cornerstone of VS-Flow projects. They provide a mechanism for
> encapsulating blocks of logic that can be employed in multiple contexts,
> much like the role fulfilled by functions in traditional software development.

In the following cell, the project is expanded with the definition of a macro responsible
for transforming a Geometry into a group of two 3D objects:
*  One of the objects is associated with a material that results in wireframe visualization.
*  The other object is associated with a material that leads to a solid visualization.

<js-cell>
const macroTo3dObject = {
    typeId:'to3dObject',
    workflow:{
        branches:[
            `(of#of)>>(standardMaterial#matWire)>>0(combineLatest#combMeshWire)`,
            `(#of)>>(standardMaterial#matPlain)>>0(combineLatest#combMeshPlain)`,
            `(identity#inputGeom)>>1(#combMeshWire)`, 
            `(#inputGeom)>>1(#combMeshPlain)`, 
            `(#combMeshWire)>>(mesh#meshWire)>>0(combineLatest#combGroup)>>(group#group)`,
            `(#combMeshPlain)>>(mesh#meshPlain)>>1(#combGroup)`,
        ],
        configurations:{ 
            meshWire: { renderOrder: 1 },
            matWire: { 
                wireframe: true,
                color:0xffffff, polygonOffset: true, polygonOffsetFactor:1
            },
            matPlain:  		{ wireframe: false, emissive: 0x072534, flatShading: true,
                              color: 0x156289 },
        }
    },
    api:{
        inputs:['0(#inputGeom)'],
        outputs: ['(#group)0']
    }
}
</js-cell>

To examine the macro, you can access it by selecting the node **to3dObject** under
the **macros** node of the project explorer.

Within this macro, the input geometry is linked to both a 'plain' material (module `matPlain`)
and a 'wireframe' material (module `matWire`) using a `combineLatest` module.
The output of this combination, consisting of arrays containing the input geometry and a material,
is then passed into a `mesh` module and amalgamated to form a group.

## Lights

<js-cell>
const macroLights = {
    typeId:'lights',
    workflow:{
        branches:[
            '(of#of)>>(hemisphereLight#hemLight)>>0(combineLatest#combLights)>>(group#grpLights)',
            '(#of)>>(pointLight#pointLight)>>1(#combLights)',
        ],
        configurations:{ 
            combLights: { inputsCount:2 },
            hemLight:   { groundColor: 0x000001 },
            pointLight: { position: {x:10, y:10, z:10} }
        }
    },
    api:{
        inputs:[],
        outputs: ['(#grpLights)0']
    }
}
</js-cell>

## All together

<js-cell>
const macroToScene = {
    typeId: 'toScene',
    workflow:{
        branches:[
            `(identity#geometries)>>(mapReduce#to3dObject)>>(group#group)>>(combineLatest#scene)`, 
            `(lights#lights)>>1(#scene)`
        ],
        configurations:{
            to3dObject:    {
                project: ({data, context, scope}) => ({
                    workflow:{
                        branches:['(to3dObject#to3d)']
                    },
                    input:'0(#to3d)',
                    output: '(#to3d)0',
                    message: {data},
                    // The next line keep instances even if done
                    // This is for debugging purposes
                    purgeOnDone: false
               })
            }
        }
    },
    api: {
        inputs:['0(#geometries)'],
        outputs: ['(#scene)0']
    }
}
</js-cell>