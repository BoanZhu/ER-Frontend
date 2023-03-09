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

let entitiesArray = [];
let attributesArray = [];
let relationshipsArray = [];

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
                // markup: util.svg`<rect @selector="body" />`,
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
                // body: {
                //     width: '90',
                //     height: '40',
                //     x: 5,
                //     y: 5,
                //     strokeWidth: 2,
                //     stroke: '#000000',
                //     transparent: true,
                //     fill: '#FFFFFF',
                // },
                // newline: {
                //     // connection: true,
                //     stroke: "#fbf5d0",
                //     strokeLinejoin: "round",
                //     strokeWidth: 20,
                //     marker: {
                //         'type': 'path',
                //         'stroke': 'red',
                //         'strokeWidth': 50,
                //         'fill': 'white',
                //         'd': 'M 10 -5 0 0 10 5 Z'
                //     }
                // }
            },
        });
    },
    async: true,
    sorting: dia.Paper.sorting.APPROX,
    interactive: { linkMove: false },
    snapLinks: { radius: 70 },
    defaultConnectionPoint: { name: 'boundary' }
});

const paperScroller = new ui.PaperScroller({
    paper,
    autoResizePaper: true,
    cursor: 'grab'
});

document.querySelector('.paper-container').appendChild(paperScroller.el);
paperScroller.render().center();

paper.on('blank:pointerdown', (evt) => {
    // Start panning the paper on mousedown
    // evt.stopPropagation();
    paperScroller.startPanning(evt);
});

// let schemaID = "";
let schemaID = "1133";
let schemaName = "Test schema";

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
        
    attrs: {
        body: {
            width: '100',
            height: '50',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF',
            level: 2,
            // event: 'StrongEntity:delete', // can add event inside the body
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
        // event: 'StrongEntity:delete',
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
        // entitiesArray.push(new_strong_entity);
        // console.log(entitiesArray);
        cell.attributes.attrs.label.text = new_strong_entity_name;
        // console.log(cell.attributes.position);
        // console.log(new_strong_entity);
        // cell.attributes.attrs.label.text = new_strong_entity_name;
        $.ajax({
            async: false,
            type: "POST",
            url: "http://10.187.204.209:8080/er/entity/create_strong",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(new_strong_entity),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success!");
                new_strong_entity.id = result.data.id;
                // console.log(new_strong_entity);
                // console.log("api result: ", result);
                entitiesArray.push(new_strong_entity);
            },
            error: function(result) {
                is_success = false;
                console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                alert(JSON.parse(result.responseText).data);
            },
        }, setTimeout(this, 1000));
    } else if (cell.attributes.type === 'myApp.Relationship') {
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
        // console.log("gggggggggggg", cell);
        // console.log(cell.attributes.target);
        console.log("Link");
        if (cell.attributes.target.id == undefined) {
            // console.log("This shoud be an attribute");
        } else {
            // console.log("The target is an element");
        }
    } else {
        console.log("Other elements");
    }
})

paper.on('cell:pointerdblclick', function(elementView, evt) {
    if (elementView.model.attributes.type === 'myApp.WeakEntity') {
        // elementView.model.remove();
        let new_weak_entity_name = window.prompt("Please enter the new name of the weak entity:", "");
        elementView.model.attributes.attrs.label.text = new_weak_entity_name;
        elementView.render();
        // console.log("aaa", elementView);
    } else if (elementView.model.attributes.type === 'myApp.StrongEntity') {
        let new_weak_strong_name = window.prompt("Please enter the new name of the strong entity:", "");
        elementView.model.attributes.attrs.label.text = new_weak_strong_name;
        elementView.render();
        // elementView.model.remove();
    } else if (elementView.model.attributes.type === 'myApp.Relationship') {
        let new_relationship_name = window.prompt("Please enter the new name of the relationship entity:", "");
        elementView.model.attributes.attrs.label.text = new_relationship_name;
        elementView.render();
        // elementView.model.remove();
    } else {
        console.log("other elements", elementView);
        // elementView.model.remove();
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
                fill: '#FFFFFF',

                // type: 'path',
                // stroke: '#000000',
                // strokeWidth: 5,
                // fill: 'white',
                // d: 'M 10 -5 0 0 10 5 Z'
            },
            label: {
                x: '50',
                y: '25',
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                fontSize: 14,
                fill: '#00879b',
                event: 'WeakEntity:changeLabel',
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
    //     <path @selector="inner" d='M 10 -5 0 0 10 5 Z' />
    //     <text @selector="label" />
    // `
});

// paper.on('myApp.WeakEntity:pointerclick', function(elementView, evt) {
//     evt.stopPropagation();
//     console.log("clicked");
// });

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


// stencil.on('EntityEntity:pointerclick', () => {
//     new_entity = {
//         "schemaID": "1123",
//         "weakEntityName": "new-weak-entity",
//         "weakEntityCardinality": "",
//         "strongEntityID": "",
//         "strongEntityCardinality": "",
//         "relationshipName": "",
//         "weakEntityLayoutInfo": "",
//         "layoutInfo": {
//             "layoutX": 123,
//             "layoutY": 456
//         }
//     }
//     $.ajax({
//         async: false,
//         type: "POST",
//         url: "http://10.187.204.209:8080/er/schema/create_weak_entity",
//         headers: { "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
//         traditional : true,
//         data: JSON.stringify(new_entity),
//         dataType: "json",
//         contentType: "application/json",
//         success: function(result) {
//             alert("success!");
//         },
//         error: function(result) {
//             is_success = false;
//             alert(JSON.parse(result.responseText).data);
//         },
//     }, setTimeout(this, 2000))
// })



// Inspector
// --------

const options = {
    arrowheadSize: [
        { value: 'M 0 0 0 0', content: 'None' },
        { value: 'M 0 -3 -6 0 0 3 z', content: 'Small' },
        { value: 'M 0 -5 -10 0 0 5 z', content: 'Medium' },
        { value: 'M 0 -10 -15 0 0 10 z', content: 'Large' },
        { value: 'M 0, 0 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0', content: 'Attribute' },
        // { value: util.svg` <rect @selector="body" />`, content: 'Attribute' },
        
    ],
    colorPaletteReset: [
        { content: 'string', icon: '../assets/no-color-icon.svg' },
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
        { offset: 300, content: 'left' }
    ],
    whetherOptional: [
        { text: "Yes", content: 'Yes' },
        { text: "No", content: 'No' }
    ],
    whetherPrimaryKey: [
        { text: "Yes", content: 'Yes' },
        { text: "No", content: 'No' }
    ]
}

paper.on('element:pointerclick link:pointerclick', (elementView, evt) => {
    // evt.stopPropagation();
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
                                body: {
                                    d: {
                                        'type': 'path',
                                        'stroke': 'red',
                                        'strokeWidth': 5,
                                        'fill': 'white',
                                        value: 'M 10 -5 0 0 10 5 Z'
                                    }
                                },
                                attrs: {
                                    text: {
                                        // textDecoration: 'underline',
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
                                            // defaultValue: '#f6f6f6', // white
                                            label: 'Text Color',
                                            index: 6
                                        },
                                        primary: {
                                            type: 'select-box',
                                            defaultValue: 'No',
                                            options: options.whetherPrimaryKey || [],
                                            label: 'Primary key',
                                            index: 2,
                                        },
                                        optional: {
                                            type: 'select-box',
                                            defaultValue: 'No',
                                            options: options.whetherOptional || [],
                                            label: 'Optional',
                                            index: 3,
                                        },
                                    },
                                    rect: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Fill',
                                            defaultValue: '#f6f6f6',
                                            index: 5,
                                        },
                                        stroke: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Outline',
                                            index: 6,
                                        },
                                        // d: {
                                        //     'type': 'path',
                                        //     'stroke': 'red',
                                        //     'strokeWidth': 5,
                                        //     'fill': 'white',
                                        //     'd': 'M 10 -5 0 0 10 5 Z'
                                        // }
                                    }
                                },
                                position: {
                                    type: 'select-box',
                                    options: options.labelPosition || [],
                                    // defaultValue: 1,
                                    offset: 200,
                                    label: 'Position',
                                    placeholder: 'Custom',
                                    index: 4,
                                    attrs: {
                                        label: {
                                            'data-tooltip': 'Position the label relative to the source of the link',
                                            'data-tooltip-position': 'right',
                                            'data-tooltip-position-selector': '.joint-inspector'
                                        }
                                    },
                                    // distance: 0.66,
                                    // offset: {
                                    //     x: -40,
                                    //     y: 80
                                    // }
                                },
    
                            }
                        }
                    },
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
                                        defaultValue: '#f6f6f6',
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
            },
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
        alert('Try to create generalisation!');
    });

    halo.on('action:link:pointerup', (linkView, evt, evt2) => {
        console.log("I'm here!!!!!");
        // console.log(linkView);
        // console.log(evt);
        // console.log(evt2);
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
        create: { index: 4 },
        currentSchema: { index: 5 },
        undoredo: { index: 6 }
    },
    tools: [
        { type: 'button', name: 'clear', group: 'clear', text: 'Clear Diagram' },
        { type: 'button', name: 'print', group: 'print', text: 'print' },
        { type: 'zoom-out', name: 'zoom-out', group: 'zoom' },
        { type: 'zoom-in', name: 'zoom-in', group: 'zoom' },
        { type: 'button', name: 'create', group: 'create', text: 'create-new-schema' },
        // { type: 'button', name: 'create', group: 'currentSchema', text: schemaName }
        // {
        //     type: 'undo',
        //     name: 'undo',
        //     group: 'undoredo',
        //     attrs: {
        //         button: {
        //             // 'data-tooltip': 'Undo'
        //         }
        //     }
        // },
        // {
        //     type: 'redo',
        //     name: 'redo',
        //     group: 'undoredo',
        //     attrs: {
        //         button: {
        //             // 'data-tooltip': 'Redo'
        //         }
        //     }
        // }
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
        schemaName = new_schema_name;
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
        graph.clear();
        // paper.render();
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
// console.log(myShape === graph.getElements()[0]);
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

// React on changes in the graph.
graph.on('change add remove', (cell) => {
    // const diagramJSONString = JSON.stringify(graph.toJSON());
    // console.log('Diagram JSON', diagramJSONString);
    console.log("change: ", cell);
    if (cell.attributes.type == 'standard.Link') {
        // This is for the attributes setting; target.id == undefined means this is an attribute
        if (cell.attributes.target.id == undefined) {

            if (cell.attributes.labels) {

                const position = calculateLabelPosition(cell);

                cell.attributes.labels[0].position = {
                    distance: 1,
                    offset: {
                        x: position.final_x,
                        y: position.final_y
                    }
                };

                if (cell.attributes.labels[0].attrs) {
                    const original_text = cell.attributes.labels[0].attrs.text.text;

                    // This is used to set the optional
                    if (cell.attributes.labels[0].attrs.text.optional == 'Yes') {
                        cell.attributes.labels[0].attrs.text.text = original_text.includes('?') ? original_text : original_text + "?";
                        cell.attributes.labels[0].position.offset.x -= 8;
                        cell.attributes.labels[0].position.offset.y -= 8;
                    } else if (cell.attributes.labels[0].attrs.text.optional == 'No') {
                        cell.attributes.labels[0].attrs.text.text = original_text.includes('?') ? original_text.substring(0, original_text.length - 1) : original_text;
                        cell.attributes.labels[0].position.offset.x -= 8;
                        cell.attributes.labels[0].position.offset.y -= 8;
                    }

                    // This is used to set primary key
                    // Here we need to reset the attribute name, because it may contains optional mark "?"
                    const new_attribute_name = cell.attributes.labels[0].attrs.text.text;
                    console.log("123: ", new_attribute_name);
                    if (cell.attributes.labels[0].attrs.text.primary == 'Yes') {
                        let underline_string = "";
                        let count = 0;
                        for (char in new_attribute_name) {
                            console.log(count);
                            underline_string += "_";
                            count++;
                        } 
                        cell.attributes.labels[0] = {
                            attrs: {
                                text: {
                                    text: new_attribute_name,
                                    primary: "Yes"
                                },
                                outer: {
                                    stroke: '#FFFFFF',
                                    fill: '#FFFFFF',
                                    text: underline_string,
                                },
                            },
                            markup: util.svg`<text @selector="text" fill="#FFFFFF"/> <text @selector="outer" fill="#FFFFFF"/>`,
                            position: {
                                distance: 1,
                                offset: {
                                    x: position.final_x - 8,
                                    y: position.final_y - 8
                                }
                            }
                        };
                    } else if (cell.attributes.labels[0].attrs.text.primary == 'No') {
                        cell.attributes.labels[0] = {
                            attrs: {
                                text: {
                                    text: new_attribute_name,
                                    primary: "No"
                                },
                            },
                            markup: util.svg`<text @selector="text" fill="#FFFFFF"/>`,
                            position: {
                                distance: 1,
                                offset: {
                                    x: position.final_x - 8,
                                    y: position.final_y - 8
                                }
                            }
                        };
                    }
                }
            }
            
            console.log("points");
            cell.attributes.attrs.line.targetMarker.d = 'M 0, 0 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0';
            // let new_strong_entity_name = window.prompt("Please enter the name of the new strong entity:", "");
        } else {

            if (cell.attributes.labels) {
                cell.attributes.labels[0].position = {
                    offset: -12
                };
            }
            console.log("element");
            // cell.attributes.attrs.line.targetMarker.d = 'M 10 -5 0 0 10 5 Z';
            cell.attributes.attrs.line.targetMarker.d = 'M 0 0 0 0';

            console.log("111", cell);
            if (cell.attributes.attrs.line.sourceMarker) {
                if (cell.attributes.attrs.line.sourceMarker.d != "M 0 0 0 0") {
                    const source_id = cell.attributes.source.id;
                    const target_id = cell.attributes.target.id;
                    // let all_elements = graph.getCells();
                    const source = graph.getCell(source_id);
                    const target = graph.getCell(target_id);
                    console.log("source: ", source);
                    console.log("target: ", target);
                    

                    const source_name = source.attributes.attrs.label.text;
                    const target_name = target.attributes.attrs.label.text;
                    let belongStrongEntityID = "";
                    let target_entity_id = "";
                    for (idx in entitiesArray) {
                        // console.log(entitiesArray[entity]);
                        if (entitiesArray[idx].name == source_name) {
                            // console.log("what happened?");
                            belongStrongEntityID = entitiesArray[idx].id;
                        }
                        if (entitiesArray[idx].name == target_name) {
                            target_entity_id = entitiesArray[idx].id; 
                        }
                    }
                    // console.log(entitiesArray);
                    console.log("belongStrongEntityID", belongStrongEntityID);
                    new_subset = {
                        "schemaID": schemaID,
                        "subsetName": target_name,
                        "belongStrongEntityID": belongStrongEntityID,
                        "aimPort": -1,
                        "layoutInfo": {
                            "layoutX": target.attributes.position.x,
                            "layoutY": target.attributes.position.y
                        }
                    };

                    delete_request = {
                        "id": target_entity_id
                    };

                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "http://10.187.204.209:8080/er/entity/delete",
                        headers: { "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                        traditional : true,
                        data: JSON.stringify(delete_request),
                        dataType: "json",
                        contentType: "application/json",
                        success: function(result) {
                            alert("success!");
                            // new_subset.id = result.data.id;
                            // console.log(new_subset);
                            // // console.log("api result: ", result);
                            // entitiesArray.push(new_subset);
                        },
                        error: function(result) {
                            is_success = false;
                            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                            alert(JSON.parse(result.responseText).data);
                        },
                    }, setTimeout(this, 1000));

                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "http://10.187.204.209:8080/er/entity/create_subset",
                        headers: { "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                        traditional : true,
                        data: JSON.stringify(new_subset),
                        dataType: "json",
                        contentType: "application/json",
                        success: function(result) {
                            alert("success!");
                            new_subset.id = result.data.id;
                            console.log(new_subset);
                            // // console.log("api result: ", result);
                            entitiesArray.push(new_subset);
                        },
                        error: function(result) {
                            is_success = false;
                            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                            alert(JSON.parse(result.responseText).data);
                        },
                    }, setTimeout(this, 1000));
                    console.log("latest entitiesarray ", entitiesArray);
                }
            }
        }
    }
});

// paper.on('link:connect', (cell, evt) => {
//     console.log("new cell: ", cell);
//     console.log("new evt: ", evt);
//     cell.model.attributes.attrs.line.targetMarker.d = 'M 10 -5 0 0 10 5 Z';
//     let new_strong_entity_name = window.prompt("Please enter the name of the new strong entity:", "");
// })

// paper.on('link:disconnect', (cell, evt) => {
//     console.log("dissssssss");
// })

// paper.on('link:mouseout', (cell) => {
//     console.log("wtfff", cell);
// })

function calculateLabelPosition(cell) {

    // Need to check the relative position of the new attribute
    // There are four cases: 1. top; 2. right; 3. bottom; 4. left
    // So we need to fetch the source element to get the original position

    let source_id = cell.attributes.source.id;

    let all_elements = graph.getCells();
    let source_x = 0;
    let source_y = 0;
    for (idx in all_elements) {
        if (all_elements[idx].id == source_id) {

            if (all_elements[idx].attributes.type == "myApp.WeakEntity") {
                source_x = all_elements[idx].attributes.position.x + all_elements[idx].attributes.attrs.outer.width / 2;
                source_y = all_elements[idx].attributes.position.y + all_elements[idx].attributes.attrs.outer.height / 2;
            } else if (all_elements[idx].attributes.type == "myApp.StrongEntity") {
                source_x = all_elements[idx].attributes.position.x + all_elements[idx].attributes.attrs.body.width / 2;
                source_y = all_elements[idx].attributes.position.y + all_elements[idx].attributes.attrs.body.height / 2;
            } else if (all_elements[idx].attributes.type == "myApp.Relationship") {
                source_x = all_elements[idx].attributes.position.x + 35;
                source_y = all_elements[idx].attributes.position.y + 35;
            }

        }
    }

    let target_x = cell.attributes.target.x;
    let target_y = cell.attributes.target.y;

    let final_x = 0;
    let final_y = 0;
    // console.log("target_x: ", target_x);
    // console.log("target_y: ", target_y);
    // console.log("source_x: ", source_x);
    // console.log("source_y: ", source_y);

    if (target_x >= source_x) {
        if (Math.abs(target_x - source_x) >= Math.abs(target_y - source_y)) {
            final_x = 30;
            final_y = 0;
        } else {
            if (target_y <= source_y) {
                final_x = 0;
                final_y = -25;
            } else {
                final_x = 0;
                final_y = 25;
            }
        }
    } else {
        if (Math.abs(target_x - source_x) >= Math.abs(target_y - source_y)) {
            final_x = -30;
            final_y = 0;
        } else {
            if (target_y <= source_y) {
                final_x = 0;
                final_y = -25;
            } else {
                final_x = 0;
                final_y = 25;
            }
            
        }
    }

    const result = {
        final_x: final_x,
        final_y: final_y
    }
    return result;
}

paper.on('link:pointerup', (cell, evt) => {
    // console.log("This is link:pointerup:", cell);
    // evt.stopPropagation();
    if (!cell.model.attributes.labels && cell.model.attributes.target.id == undefined) {
        let new_attribute_name = window.prompt("Please enter the name of the attribute:", "");

        cell.addLabel({});

        const position = calculateLabelPosition(cell.model);

        cell.model.attributes.labels[0] = {
            attrs: {
                text: {
                    text: new_attribute_name,
                    optional: "No",
                    primary: "No",
                },
                // outer: {
                //     // width: '90',
                //     // height: '40',
                //     // x: 5,
                //     // y: 5,
                //     // strokeWidth: 2,
                //     stroke: '#FFFFFF',
                //     fill: '#FFFFFF',
                //     text: underline_string,
                // },
                
            },
            markup: util.svg`<text @selector="text" fill="#FFFFFF"/> `,
            position: {
                distance: 1,
                offset: {
                    x: position.final_x - 8,
                    y: position.final_y - 8
                }
            }
        };
        // console.log("new label: ", cell);
    }
})

// paper.on('cell:pointerup', (cell) => {
//     // evt.stopPropagation();
//     console.log("This is :", cell);
// })

graph.on('change:level', (cell, level) => {
    const color = (level > 8) ? '#ff9580' : '#ffffff';
    cell.prop('attrs/body/fill', color);
});
