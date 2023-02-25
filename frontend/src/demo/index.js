/*! JointJS+ v3.6.3 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2022 client IO

 2023-01-17 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


const { setTheme, dia, shapes, ui, util, linkTools } = joint;
// For modules:
// import { setTheme, dia, shapes, ui, util, linkTools } from '@clientio/rappid';

// Set a theme (optional - use a theme or custom-style)
// ----------------------------------------------------

setTheme('dark');
//setTheme('material');
//setTheme('modern');
//setTheme('default');

// Graph
// -----

const graph = new dia.Graph({}, { cellNamespace: shapes });

// Paper & PaperScroller
// ---------------------

const paper = new dia.Paper({
    model: graph, // Set graph as the model for paper
    cellViewNamespace: shapes,
    width: 1000,
    height: 1000,
    gridSize: 10,
    drawGrid: true,
    defaultLink: (elementView, magnet) => {
        return new shapes.standard.Link({
            attrs: { 
                line: { 
                    stroke: '#fbf5d0',
                    // strokeWidth: 1,
                    // sourceMarker: {
                    //     'type': 'path',
                    //     'stroke': 'red',
                    //     'strokeWidth': 3,
                    //     'fill': 'white',
                    //     'd': 'M 10 -5 0 0 10 5 Z'
                    // },
                    targetMarker: {
                        'type': 'path',
                        'stroke': 'red',
                        'strokeWidth': 5,
                        'fill': 'white',
                        'd': 'M 10 -5 0 0 10 5 Z'
                    }
                }, 
                // label: {
                //     x: '50',
                //     y: '50',
                //     textAnchor: 'middle',
                //     textVerticalAnchor: 'middle',
                //     fontSize: 14,
                //     fill: '#333333',
                //     text: "111",
                // },
            }
        });
    },
    async: true,
    sorting: dia.Paper.sorting.APPROX,
    interactive: { linkMove: false },
    snapLinks: { radius: 70 },
    defaultConnectionPoint: { name: 'boundary' }
});

// const newShape = new MyShape({
//     size: { width: 100, height: 100 },
//     position: { x: 50, y: 50 },
//     attrs: {
//         label: { text: 'My Shape' }
//     },
//     level: 3,
//     ports: { items: [{ id: 'in1', group: 'in' }, { group: 'out', id: 'out1' }] }
// });
// graph.addCell(newShape);

const paperScroller = new ui.PaperScroller({
    paper,
    autoResizePaper: true,
    cursor: 'grab'
});

document.querySelector('.paper-container').appendChild(paperScroller.el);
paperScroller.render().center();

paper.on('blank:pointerdown', (evt) => {
    // Start panning the paper on mousedown
    evt.stopPropagation();
    paperScroller.startPanning(evt);
});

let schemaID = "";

// Custom Shape
// ------------

const MyShape = dia.Element.define('myApp.MyShape', {
    attrs: {
        body: {
            width: 'calc(w)',
            height: 'calc(h)',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
        },
        label: {
            x: 'calc(w/2)',
            y: 'calc(h/2)',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontSize: 14,
            fill: '#00879b',
            level: 1,
        },
        root: {
            magnet: false // Disable the possibility to connect the body of our shape. Only ports can be connected.
        }
    },
    level: 1,
    ports: {
        groups: {
            'in': {
                markup: util.svg`<circle @selector="portBody"/>`,
                z: -1,
                attrs: {
                    portBody: {
                        r: 12,
                        magnet: true,
                        fill: '#00879b'
                    }
                },
                position: { name: 'left' },
                label: { position: { name: 'left' }}
            },
            'out': {
                markup: util.svg`<circle @selector="portBody"/>`,
                z: -1,
                attrs: {
                    portBody: {
                        r: 12,
                        magnet: true,
                        fill: '#00879b'
                    }
                },
                position: { name: 'right' },
                label: { position: { name: 'right' }}
            }
        }
    }
}, {
    // markup: util.svg`
    //     <rect @selector="body" />
    //     <text @selector="label" />
    // `
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }]
});

const StrongEntity = dia.Element.define('myApp.StrongEntity', {
        
    // type: 'erd.WeakEntity',
    // size: { width: 90, height: 360 },
    attrs: {
        body: {
            width: '100',
            height: '50',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF',
            level: 2,
            event: 'StrongEntity:delete', // can add event inside the body
        },
        label: {
            x: '50',
            y: '25',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontSize: 14,
            fill: '#00879b',
            level: 1,
            event: 'StrongEntity:delete',
        },
        event: 'StrongEntity:delete',
    }

}, {
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }]
});

// StrongEntity.on('change:position', function(StrongEntity, position) {
//     alert('element1 moved to ' + position.x + ',' + position.y);
//   });

// paper.on('StrongEntity:delete', function(elementView, evt) {
//     // Stop any further actions with the element view e.g. dragging
//     evt.stopPropagation();
//     if (confirm('Are you sure you want to delete this element?')) {
//         elementView.model.remove();
//     }
//   });

graph.on('add', function(cell) { 
    // alert('New cell with id ' + cell.id + ' added to the graph.') 
    // console.log(cell);
    if (cell.attributes.type === 'myApp.WeakEntity') {
        console.log("Weak entity");
        // new_entity = {
        //     "schemaID": schemaID,
        //     "weakEntityName": "new-weak-entity",
        //     "weakEntityCardinality": "",
        //     "strongEntityID": "",
        //     "strongEntityCardinality": "",
        //     "relationshipName": "",
        //     "weakEntityLayoutInfo": "",
        //     "layoutInfo": {
        //         "layoutX": 123,
        //         "layoutY": 456
        //     }
        // }
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://10.187.204.209:8080/er/schema/create_weak_entity",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(new_entity),
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(result) {
        //         alert("success!");
        //     },
        //     error: function(result) {
        //         is_success = false;
        //         alert(JSON.parse(result.responseText).data);
        //     },
        // }, setTimeout(this, 2000))
    } else if (cell.attributes.type === 'myApp.StrongEntity') {
        console.log('Strong entity');
        let new_strong_entity_name = window.prompt("Please enter the name of the new strong entity:", "");
        new_strong_entity = {
            "schemaID": schemaID,
            "name": new_strong_entity_name,
            "layoutInfo": {
                "layoutX": cell.attributes.position.x,
                "layoutY": cell.attributes.position.y
            }
        }
        cell.attributes.attrs.label.text = new_strong_entity_name;
        // console.log(cell.attributes.position);
        // console.log(new_strong_entity);
        // cell.attributes.attrs.label.text = new_strong_entity_name;
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://10.187.204.209:8080/er/entity/create_strong",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(new_strong_entity),
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(result) {
        //         alert("success!");
        //         console.log(result);
        //     },
        //     error: function(result) {
        //         is_success = false;
        //         console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
        //         alert(JSON.parse(result.responseText).data);
        //     },
        // }, setTimeout(this, 1000))
    } else if (cell.attributes.type === 'myApp.Relationship') {
        console.log("new schemaID: ", schemaID);
        console.log('Relationship');
        let new_relationship_name = window.prompt("Please enter the name of the new relationship:", "");
        new_relationship = {
            "schemaID": schemaID,
            "name": new_relationship_name,
            "layoutInfo": {
                "layoutX": 123,
                "layoutY": 456
            }
        }
        cell.attributes.attrs.label.text = new_relationship_name;
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://146.169.160.255:8080/er/entity/create_strong",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(new_entity),
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(result) {
        //         alert("success!");
        //     },
        //     error: function(result) {
        //         is_success = false;
        //         alert(JSON.parse(result.responseText).data);
        //     },
        // }, setTimeout(this, 1000))
    } else if (cell.attributes.type == 'standard.Link') {
        console.log(cell.attributes.target);
        console.log("Link");
        if (cell.attributes.target.id == undefined) {
            console.log("trueeeeee");
        } else {
            console.log("The target is an element");
        }
    } else {
        console.log("Other elements");
    }
})

paper.on('cell:pointerdblclick', function(elementView, evt) {
    // evt.stopPropagation();
    // if (elementView.model.type) {

    // }
    console.log(elementView.model.attributes.type === 'myApp.WeakEntity');
    if (elementView.model.attributes.type === 'myApp.WeakEntity') {
        elementView.model.remove();
    } else if (elementView.model.attributes.type === 'myApp.StrongEntity') {
        elementView.model.remove();
    } else if (elementView.model.attributes.type === 'myApp.Relationship') {
        elementView.model.remove();
    } else {
        elementView.model.remove();
    }
    // elementView.model.remove();
})

// paper.on('cell:pointerclick', function(elementView, evt) {
//     evt.stopPropagation();
//     // if (elementView.model.type) {
//     console.log("123");
//     // }
//     console.log(elementView.model.attributes.type === 'myApp.WeakEntity');
//     if (elementView.model.attributes.type === 'myApp.WeakEntity') {
//         console.log("weak");
//         // elementView.model.remove();
//     } else if (elementView.model.attributes.type === 'myApp.StrongEntity') {
//         console.log("strong");
//         // elementView.model.remove();
//     } else if (elementView.model.attributes.type === 'myApp.Relationship') {
//         console.log("relationship");
//         // elementView.model.remove();
//     } else {
//         console.log("else");
//         // elementView.model.remove();
//     }
//     // elementView.model.remove();
// })

var variable =  new joint.shapes.basic.Rect({
    name : "123",
    id: 123,
    onclick : function () {alert("hello");},
    size: { width: 10, height: 10 },
    attrs: {
        text: { text: "123", 'font-size': 10, 'font-family': 'monospace' },
        rect: {
            fill : "red", 
            width: 10, height: 10,
            rx: 5, ry: 5,
            stroke: '#555',
        }   
    }   
}); 
variable.on('batch:stop', function (element) {alert(""); toggleEvidence(element.name);});

const WeakEntity = dia.Element.define('myApp.WeakEntity', {
        attrs: {
            // body: {
            //     inner: {
            //         width: '80',
            //         height: '40',
            //         strokeWidth: 2,
            //         stroke: '#000000',
            //         fill: '#FFFFFF',
            //     },
            //     outer: {
            //         width: '100',
            //         height: '50',
            //         strokeWidth: 2,
            //         stroke: '#000000',
            //         fill: '#FFFFFF'
            //     }
            // },
            inner: {
                width: '90',
                height: '40',
                x: 5,
                y: 5,
                strokeWidth: 2,
                stroke: '#000000',
                transparent: true,
                fill: '#FFFFFF',
            },
            outer: {
                width: '100',
                height: '50',
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFFFFF'
            },
            label: {
                x: '50',
                y: '25',
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                fontSize: 14,
                fill: '#00879b'
            },
            
            // root: {
            //     dataTooltip: 'Weak Entity',
            //     dataTooltipPosition: 'left',
            //     dataTooltipPositionSelector: '.joint-stencil'
            // },
            // '.outer': {
            //     fill: 'transparent',
            //     stroke: '#feb663',
            //     'stroke-width': 2,
            //     points: '100,0 100,60 0,60 0,0',
            //     'stroke-dasharray': '0'
            // },
            // '.inner': {
            //     fill: '#feb663',
            //     stroke: 'transparent',
            //     points: '97,5 97,55 3,55 3,5',
            //     'stroke-dasharray': '0'
            // },
            // text: {
            //     text: 'Weak entity',
            //     'font-size': 11,
            //     'font-family': 'Roboto Condensed',
            //     'font-weight': 'Normal',
            //     fill: '#f6f6f6',
            //     'stroke-width': 0
            // }
        }
    
}, {
    markup: [{
        tagName: 'rect',
        selector: 'outer',
    }, {
        tagName: 'rect',
        selector: 'inner',
    }, {
        tagName: 'text',
        selector: 'label',
    }]
    // markup:
    //     util.svg`
    //     <rect @selector="outer" />
    //     <text @selector="label" />
    // `
});

const relationship = dia.Element.define('myApp.Relationship', {
    attrs: {
        body: {
            width: '50',
            height: '50',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF',
            level: 2,
            // rotate: 90,
            // path: "50,10 55,30 70,30 60,40 65,55 50,45 35,55 40,40 30,30 45,30"
        },
        text: {
            // text: 'Relation',
            x: '25',
            y: '25',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontFamily: 'Roboto Condensed',
            fontWeight: 'Normal',
            fill: '#00879b',
            strokeWidth: 0
        }
    }
}, {
    // <path d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z" />
    markup: util.svg`
        <rect @selector="body" transform='rotate(45, 25, 25)' />
        <text @selector="label" x="0" y="15" fill="red" />
    `
})

// StrongEntity.attrs({width: 100, height: 50});

// const weakEntity = dia.Element.define('myApp.StrongEntity', {
//     attrs: {
//         body: {
//             width: 'calc(w)',
//             height: 'calc(h)',
//             strokeWidth: 2,
//             stroke: '#000000',
//             fill: '#FFFFFF'
//         },
//         label: {
//             x: 'calc(w/2)',
//             y: 'calc(h/2)',
//             textAnchor: 'middle',
//             textVerticalAnchor: 'middle',
//             fontSize: 14,
//             fill: '#333333'
//         },
//         root: {
//             magnet: false // Disable the possibility to connect the body of our shape. Only ports can be connected.
//         }
//     },
// });


// Stencil
// -------

const stencil = new ui.Stencil({
    paper: paperScroller,
    scaleClones: true,
    width: 240,
    groups: {
        // myShapesGroup1: { index: 1, label: ' My Shapes 1' },
        myShapesGroup2: { index: 2, label: ' Entity - Relationship' }
    },
    dropAnimation: true,
    groupsToggleButtons: true,
    search: {
        '*': ['type', 'attrs/label/text']
    },
    layout: true  // Use the default 2 columns layout with auto-resize
});

document.querySelector('.stencil-container').appendChild(stencil.el);
stencil.render().load({
    // myShapesGroup1: [{
    //     type: 'standard.Rectangle'
    // }, {
    //     type: 'standard.Ellipse'
    // }],
    myShapesGroup2: [
    // {
    //     type: 'standard.Cylinder'
    // }, {
    //     type: 'myApp.MyShape',
    //     attrs: { label: { text: 'Shape' }},
    //     ports: { items: [{ group: 'in' }, { group: 'out' }, { group: 'out' }] }
    // }, 
    {
        type: 'myApp.StrongEntity',
        attrs: { label: { text: 'Entity' }}
    }, {
        type: 'myApp.WeakEntity',
        attrs: { label: { text: 'WeakEntity' }}
    }, {
        type: 'myApp.Relationship',
        attrs: { label: { text: 'Relation' } }
    }, 
    // {
        // variable
    // } 
]
});

stencil.on('myApp.StrongEntity:pointerclick', () => {
    console.log("111");
    // new_entity = {
    //     "schemaID": "1123",
    //     "name": "new-strong-entity",
    //     "layoutInfo": {
    //         "layoutX": 123,
    //         "layoutY": 456
    //     }
    // }
    // $.ajax({
    //     async: false,
    //     type: "POST",
    //     url: "http://146.169.160.255:8080/er/entity/create_strong",
    //     headers: { "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
    //     traditional : true,
    //     data: JSON.stringify(new_entity),
    //     dataType: "json",
    //     contentType: "application/json",
    //     success: function(result) {
    //         alert("success!");
    //     },
    //     error: function(result) {
    //         is_success = false;
    //         alert(JSON.parse(result.responseText).data);
    //     },
    // }, setTimeout(this, 1000))
})


stencil.on('EntityEntity:pointerclick', () => {
    new_entity = {
        "schemaID": "1123",
        "weakEntityName": "new-weak-entity",
        "weakEntityCardinality": "",
        "strongEntityID": "",
        "strongEntityCardinality": "",
        "relationshipName": "",
        "weakEntityLayoutInfo": "",
        "layoutInfo": {
            "layoutX": 123,
            "layoutY": 456
        }
    }
    $.ajax({
        async: false,
        type: "POST",
        url: "http://10.187.204.209:8080/er/schema/create_weak_entity",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(new_entity),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
        },
        error: function(result) {
            is_success = false;
            alert(JSON.parse(result.responseText).data);
        },
    }, setTimeout(this, 2000))
})



// Inspector
// --------

const options = {
    arrowheadSize: [
        { value: 'M 0 0 0 0', content: 'None' },
        { value: 'M 0 -3 -6 0 0 3 z', content: 'Small' },
        { value: 'M 0 -5 -10 0 0 5 z', content: 'Medium' },
        { value: 'M 0 -10 -15 0 0 10 z', content: 'Large' },
        
    ],
    colorPaletteReset: [
        { content: 'string', icon: '/assets/no-color-icon.svg' },
        { content: '#f6f6f6' },
        { content: '#dcd7d7' },
        { content: '#8f8f8f' },
        { content: '#c6c7e2' },
        { content: '#feb663' },
        { content: '#fe854f' },
        { content: '#b75d32' },
        { content: '#31d0c6' },
        { content: '#7c68fc' },
        { content: '#61549c' },
        { content: '#6a6c8a' },
        { content: '#4b4a67' },
        { content: '#3c4260' },
        { content: '#33334e' },
        { content: '#222138' }
    ],
    labelPosition: [
        { value: 1, content: 'attribute' },
        // { value: 0.5, content: 'Cardinality' },
        // { offset: 0.1, content: 'left' },
    ],
}

paper.on('element:pointerclick link:pointerclick', (elementView, evt) => {
    evt.stopPropagation();
    console.log(elementView.model.attributes.type);
    console.log(elementView);
    // console.log("1111111");
    if (elementView.model.attributes.type == "standard.Link") {
        if (elementView.model.attributes.target.id == undefined) {
            ui.Inspector.create('.inspector-container', {
                cell: elementView.model,
                inputs: {
                    labels: {
                        type: 'list',
                        group: 'basic',
                        label: 'Attribute name',
                        attrs: {
                            label: {
                                'data-tooltip': 'Set (possibly multiple) labels for the link',
                                'data-tooltip-position': 'right',
                                'data-tooltip-position-selector': '.joint-inspector',
                            }
                        },
                        item: {
                            type: 'object',
                            properties: {
                                attrs: {
                                    text: {
                                        text: {
                                            type: 'content-editable',
                                            label: 'Attribute Name',
                                            defaultValue: 'name',
                                            index: 1,
                                            attrs: {
                                                label: {
                                                    'data-tooltip': 'Set text of the label',
                                                    'data-tooltip-position': 'right',
                                                    'data-tooltip-position-selector': '.joint-inspector'
                                                }
                                            }
                                        },
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Text Color',
                                            index: 5
                                        }
                                    },
                                    rect: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Fill',
                                            index: 3
                                        },
                                        stroke: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Outline',
                                            index: 4
                                        }
                                    }
                                },
                                position: {
                                    type: 'select-box',
                                    options: options.labelPosition || [],
                                    defaultValue: 0.5,
                                    label: 'Position',
                                    placeholder: 'Custom',
                                    index: 2,
                                    attrs: {
                                        label: {
                                            'data-tooltip': 'Position the label relative to the source of the link',
                                            'data-tooltip-position': 'right',
                                            'data-tooltip-position-selector': '.joint-inspector'
                                        }
                                    }
                                },
    
                            }
                        }
                    },
                    // attrs: { 
                    //     // line: { stroke: '#fbf5d0' }, 
                    //     label: {
                    //         textAnchor: 'middle',
                    //         textVerticalAnchor: 'middle',
                    //         fontSize: 14,
                    //         fill: '#333333',
                    //         text: "111",
                    //     },
                    // },
                    // 'attrs/label/text': {
                    //     // type: 'text',
                    //     // label: 'Cardinality constraint',
                    //     text: "123",
                    //     // group: 'basic',
                    //     // index: 1,
                    //     // event: 'link:setLabel'
                    // },
                    'attrs/line/sourceMarker': {
                        d: {
                            type: 'select-box',
                            options: options.arrowheadSize,
                            group: 'marker-source',
                            label: 'Source arrowhead',
                            index: 1
                        },
                        // fill: {
                        //     type: 'color-palette',
                        //     options: options.colorPaletteReset,
                        //     group: 'marker-source',
                        //     label: 'Color',
                        //     when: { ne: { 'attrs/line/sourceMarker/d': 'M 0 0 0 0' }},
                        //     index: 2
                        // }
                    },
                    // 'attrs/line': {
                    //     targetMarker: {
                    //         d: {
                    //             // type: 'select-box',
                    //             // options: options.arrowheadSize,
                    //             // group: 'marker-target',
                    //             // label: 'Target arrowhead',
                    //             // index: 1,
                    //         },
                    //         stroke: {'black'},
                    //         fill: 'yellow',
                    //     }
                    // }
    
                    // 'attrs/line/targetMarker': {
                    //     d: {
                    //         type: 'select-box',
                    //         options: options.arrowheadSize,
                    //         group: 'marker-target',
                    //         label: 'Target arrowhead',
                    //         index: 1,
                    //         stroke: 'black'
                    //     },
    
                    //     'stroke': 'black',
                    //     'fill': 'yellow',
                        // fill: {
                        //     type: 'color-palette',
                        //     options: options.colorPaletteReset,
                        //     group: 'marker-target',
                        //     label: 'Color',
                        //     when: { ne: { 'attrs/line/targetMarker/d': 'M 0 0 0 0' }},
                        //     index: 2
                        // }
                    // }
                },
                // label: {
                //     'attrs/text': {
                //         type: 'text',
                //         label: 'Cardinality constraint',
                //         group: 'basic',
                //         index: 1,
                //         event: 'link:setLabel'
                //     }
                // },
                groups: {
                    basic: {
                        label: 'Basic',
                        index: 1
                    },
                    'marker-source': {
                        label: 'Source marker',
                        index: 3
                    },
                    // 'marker-target': {
                    //     label: 'Target marker',
                    //     index: 4
                    // },
    
                }
            });
        
        } else {
        ui.Inspector.create('.inspector-container', {
            cell: elementView.model,
            inputs: {
                labels: {
                    type: 'list',
                    group: 'basic',
                    label: 'Add cardinality',
                    attrs: {
                        label: {
                            'data-tooltip': 'Set (possibly multiple) labels for the link',
                            'data-tooltip-position': 'right',
                            'data-tooltip-position-selector': '.joint-inspector',
                            // position: {
                            //     distance: 0.25
                            // }
                        }
                    },
                    item: {
                        type: 'object',
                        properties: {
                            attrs: {
                                text: {
                                    text: {
                                        type: 'content-editable',
                                        label: 'Cardinality ratio',
                                        defaultValue: '0:N',
                                        index: 1,
                                        attrs: {
                                            label: {
                                                'data-tooltip': 'Set text of the label',
                                                'data-tooltip-position': 'right',
                                                'data-tooltip-position-selector': '.joint-inspector'
                                            }
                                        }
                                    },
                                    fill: {
                                        type: 'color-palette',
                                        options: options.colorPaletteReset,
                                        label: 'Text Color',
                                        index: 5
                                    }
                                },
                                rect: {
                                    fill: {
                                        type: 'color-palette',
                                        options: options.colorPaletteReset,
                                        label: 'Fill',
                                        index: 3
                                    },
                                    stroke: {
                                        type: 'color-palette',
                                        options: options.colorPaletteReset,
                                        label: 'Outline',
                                        index: 4
                                    }
                                }
                            },
                            // position: {
                            //     type: 'select-box',
                            //     options: options.labelPosition || [],
                            //     defaultValue: 0.5,
                            //     label: 'Position',
                            //     placeholder: 'Custom',
                            //     index: 2,
                            //     attrs: {
                            //         label: {
                            //             'data-tooltip': 'Position the label relative to the source of the link',
                            //             'data-tooltip-position': 'right',
                            //             'data-tooltip-position-selector': '.joint-inspector'
                            //         }
                            //     }
                            // },

                        }
                    }
                },
                // attrs: { 
                //     // line: { stroke: '#fbf5d0' }, 
                //     label: {
                //         textAnchor: 'middle',
                //         textVerticalAnchor: 'middle',
                //         fontSize: 14,
                //         fill: '#333333',
                //         text: "111",
                //     },
                // },
                // 'attrs/label/text': {
                //     // type: 'text',
                //     // label: 'Cardinality constraint',
                //     text: "123",
                //     // group: 'basic',
                //     // index: 1,
                //     // event: 'link:setLabel'
                // },
                'attrs/line/sourceMarker': {
                    d: {
                        type: 'select-box',
                        options: options.arrowheadSize,
                        group: 'marker-source',
                        label: 'Source arrowhead',
                        index: 1
                    },
                    // fill: {
                    //     type: 'color-palette',
                    //     options: options.colorPaletteReset,
                    //     group: 'marker-source',
                    //     label: 'Color',
                    //     when: { ne: { 'attrs/line/sourceMarker/d': 'M 0 0 0 0' }},
                    //     index: 2
                    // }
                },
                // 'attrs/line': {
                //     targetMarker: {
                //         d: {
                //             // type: 'select-box',
                //             // options: options.arrowheadSize,
                //             // group: 'marker-target',
                //             // label: 'Target arrowhead',
                //             // index: 1,
                //         },
                //         stroke: {'black'},
                //         fill: 'yellow',
                //     }
                // }

                // 'attrs/line/targetMarker': {
                //     d: {
                //         type: 'select-box',
                //         options: options.arrowheadSize,
                //         group: 'marker-target',
                //         label: 'Target arrowhead',
                //         index: 1,
                //         stroke: 'black'
                //     },

                //     'stroke': 'black',
                //     'fill': 'yellow',
                    // fill: {
                    //     type: 'color-palette',
                    //     options: options.colorPaletteReset,
                    //     group: 'marker-target',
                    //     label: 'Color',
                    //     when: { ne: { 'attrs/line/targetMarker/d': 'M 0 0 0 0' }},
                    //     index: 2
                    // }
                // }
            },
            // label: {
            //     'attrs/text': {
            //         type: 'text',
            //         label: 'Cardinality constraint',
            //         group: 'basic',
            //         index: 1,
            //         event: 'link:setLabel'
            //     }
            // },
            groups: {
                basic: {
                    label: 'Basic',
                    index: 1
                },
                'marker-source': {
                    label: 'Source marker',
                    index: 3
                },
                // 'marker-target': {
                //     label: 'Target marker',
                //     index: 4
                // },

            }
        });
    }
    } else {
        ui.Inspector.create('.inspector-container', {
            cell: elementView.model,
            inputs: {
                'attrs/label/text': {
                    type: 'text',
                    label: 'Name',
                    group: 'basic',
                    index: 1
                },
                level: {
                    type: 'range',
                    min: 1,
                    max: 10,
                    unit: 'x',
                    defaultValue: 6,
                    label: 'Level',
                    group: 'advanced',
                    index: 2
                },
            },
            groups: {
                basic: {
                    label: 'Basic',
                    index: 1
                },
                advanced: {
                    label: 'Advanced',
                    index: 2
                }
            }
        });
    
    }
});

paper.on('link:setLabel:pointerclick', function(elementView, evt) {
    console.log("1111111111111");
    // Stop any further actions with the element view e.g. dragging
    // evt.stopPropagation();
    // if (confirm('Are you sure you want to delete this element?')) {
    //     elementView.model.remove();
    // }
});

// link:pointerdown
paper.on('blank:pointerdown', () => {
    ui.Inspector.close();
});

// Halo
// ----

paper.on('element:pointerclick', (elementView) => {
    const handles = [{
        name: 'remove',
        position: 'nw',
        events: { pointerdown: 'removeElement' }
    }, {
        name: 'myCustomAction',
        position: 'ne',
        icon: 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
    }];
    if (!elementView.model.hasPorts()) {
        // Only shapes without ports will have the "link" handle in the Halo control panel. Shapes with ports can be connected by "dragging" ports.
        handles.push({
            name: 'link',
            position: 'e',
            events: { pointerdown: 'startLinking', pointermove: 'doLink', pointerup: 'stopLinking' }
        });
    }
    const halo = new ui.Halo({
        cellView: elementView,
        handles
    }).render();

    halo.on('action:myCustomAction:pointerdown', (evt) => {
        alert('My Control Button Clicked!');
    });

    halo.on('action:link:pointerup', (linkView, evt, evt2) => {
        console.log("I'm here!");
        console.log(linkView);
        console.log(evt);
        console.log(evt2);
    });
});

// Link Tools
// ----------

paper.on('link:pointerclick', (linkView) => {
    paper.removeTools();
    const toolsView = new dia.ToolsView({
        tools: [
            new linkTools.Vertices(),
            new linkTools.SourceArrowhead(),
            new linkTools.TargetArrowhead(),
            new linkTools.Segments,
            new linkTools.Remove({ offset: -20, distance: 40 })
        ]
    });
    linkView.addTools(toolsView);
});

paper.on('blank:pointerdown', (evt) => {
    paper.removeTools();
});

// Toolbar
// -------

const toolbar = new ui.Toolbar({
    groups: {
        print: { index: 1 },
        clear: { index: 2 },
        zoom: { index: 3 },
        create: { index: 4 }
    },
    tools: [
        { type: 'button', name: 'clear', group: 'clear', text: 'Clear Diagram' },
        { type: 'button', name: 'print', group: 'print', text: 'print' },
        { type: 'zoom-out', name: 'zoom-out', group: 'zoom' },
        { type: 'zoom-in', name: 'zoom-in', group: 'zoom' },
        { type: 'button', name: 'create', group: 'create', text: 'create-new-schema' },
    ],
    references: {
        paperScroller // built in zoom-in/zoom-out control types require access to paperScroller instance
    }
});

toolbar.on({
    'clear:pointerclick': () => graph.clear(),
    'print:pointerclick': () => console.log("print"),
    'create:pointerclick': () => {
        let new_schema_name = window.prompt("Please enter the name of the new schema:", "");
        console.log(new_schema_name);
        request = {
            "name": new_schema_name
        }
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://10.187.204.209:8080/er/schema/create",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(request),
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(result) {
        //         alert("success!");
        //         schemaID = result.data.id;
        //         console.log("create new schema with ", result.data.id);
        //     },
        //     error: function(result) {
        //         is_success = false;
        //         alert(JSON.parse(result.responseText).data);
        //     },
        // }, setTimeout(this, 2000))
        graph.clear()
    }
        // window.prompt("Please enter the name of the new schema:","")
        // // .then(
        // request = {
        //     "username": "test",
        //     "password": "test"
        // },
        // console.log("123"),
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://10.187.204.209:8080/er/login/check_account",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(request),
        //     dataType: "json",
        //     contentType: "application/json",
        //     success: function(result) {
        //         alert("success!");
        //     },
        //     error: function(result) {
        //         is_success = false;
        //         alert(JSON.parse(result.responseText).data);
        //     }
        // })
    // )
    // }
});

document.querySelector('.toolbar-container').appendChild(toolbar.el);
toolbar.render();

console.log("schemaID: ", schemaID);

// Working With Diagrams Programmatically
// --------------------------------------

// Add new element to the graph.
const myShape = new MyShape({
    size: { width: 100, height: 100 },
    position: { x: 50, y: 50 },
    attrs: { label: { text: 'My Shape' }},
    level: 3,
    ports: { items: [{ id: 'in1', group: 'in' }, { group: 'out', id: 'out1' }] }
});
graph.addCell(myShape);

const newShape = new MyShape({
    size: { width: 100, height: 100 },
    position: { x: 500, y: 500 },
    attrs: { label: { text: 'My Shape' }},
    level: 3,
    ports: { items: [{ id: 'in1', group: 'in' }, { group: 'out', id: 'out1' }] }
});
graph.addCell(newShape);

// Get element from the graph and change its properties.
console.log(myShape === graph.getElements()[0]);
myShape.prop('attrs/label/text', 'My Updated Shape');
myShape.prop('size/width', 150);
myShape.prop('level', 2);
myShape.prop('attrs/body/fill', '#80eaff');

// Create a clone of an element.
const myShape2 = myShape.clone();
myShape2.translate(400, 0);
graph.addCell(myShape2);

const myShape3 = myShape.clone();
myShape3.rotate(30);
myShape3.translate(700, 0);
graph.addCell(myShape3);

// Create a link that connects two elements.
const myLink = new shapes.standard.Link({
    attrs: { line: { stroke: '#fbf5d0' }},
    source: { id: myShape.id, port: 'out1' },
    target: { id: myShape2.id, port: 'in1' }
});
graph.addCell(myLink);



// paper.on('link:connect', (cell, evt) => {
//     console.log("new cell: ", cell);
//     console.log("new evt: ", evt);
//     cell.model.attributes.attrs.line.targetMarker.d = 'M 10 -5 0 0 10 5 Z';
//     let new_strong_entity_name = window.prompt("Please enter the name of the new strong entity:", "");
// })

// paper.on('link:disconnect', (cell, evt) => {
//     console.log("dissssssss");
// })

// paper.on('pointerup', (cell) => {
//     evt.stopPropagation();
//     console.log("This is :", cell);
// })

graph.on('change:level', (cell, level) => {
    const color = (level > 8) ? '#ff9580' : '#ffffff';
    cell.prop('attrs/body/fill', color);
});