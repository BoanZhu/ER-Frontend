/*! JointJS+ v3.6.3 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2022 client IO

 2023-01-17 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/

// import { CloudLightning } from "react-bootstrap-icons";

// import { config } from "process";


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

// const ip_address = "146.169.162.32";
const ip_address = "10.187.204.209";

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
                    targetMarker: {
                        'type': 'path',
                        'stroke': 'red',
                        'strokeWidth': 5,
                        'fill': 'white',
                        'd': 'M 10 -5 0 0 10 5 Z'
                    }
                }, 
            },
        });
    },
    async: true,
    sorting: dia.Paper.sorting.APPROX,
    interactive: { linkMove: false },
    snapLinks: { radius: 70 },
    magnet: false,
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
            magnet: false,
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

graph.on('add', function(cell) { 
    if (cell.attributes.type === 'myApp.WeakEntity') {
        let new_weak_entity_name = window.prompt("Please enter the name of the new weak entity:", "");
        new_weak_entity = {
            "schemaID": schemaID,
            "weakEntityName": new_weak_entity_name,
            "weakEntityCardinality": "",
            "strongEntityID": "",
            "strongEntityCardinality": "",
            "relationshipName": "",
            "weakEntityLayoutInfo": {
                "layoutX": cell.attributes.position.x,
                "layoutY": cell.attributes.position.y
            }
        }
        cell.attributes.attrs.label.text = new_weak_entity_name;
        entitiesArray.push(new_weak_entity);
        // $.ajax({
        //     async: false,
        //     type: "POST",
        //     url: "http://10.187.204.209:8080/er/schema/create_weak_entity",
        //     headers: { "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        //     traditional : true,
        //     data: JSON.stringify(new_weak_entity),
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
        $.ajax({
            async: false,
            type: "POST",
            url: "http://" + ip_address + ":8080/er/entity/create_strong",
            // url: "http://10.187.204.209:8080/er/entity/create_strong",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(new_strong_entity),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success!");
                new_strong_entity.id = result.data.id;
                entitiesArray.push(new_strong_entity);
            },
            error: function(result) {
                is_success = false;
                console.log("Strong entity result: ", result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                alert(JSON.parse(result.responseText).data);
            },
        });
    } else if (cell.attributes.type === 'myApp.Relationship') {
        let new_relationship_name = window.prompt("Please enter the name of the new relationship:", "");
        new_relationship = {
            "schemaID": schemaID,
            "name": new_relationship_name,
            "layoutInfo": {
                "layoutX": cell.attributes.position.x,
                "layoutY": cell.attributes.position.y
            }
        }
        cell.attributes.attrs.label.text = new_relationship_name;
        $.ajax({
            async: false,
            type: "POST",
            url: "http://" + ip_address + ":8080/er/relationship/create_nary",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(new_relationship),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success!");
                console.log("relationship result: ", result);
                new_relationship.id = result.data.id;
                new_relationship.belongObjWithCardinalityList = [];
                relationshipsArray.push(new_relationship);
            },
            error: function(result) {
                is_success = false;
                alert(JSON.parse(result.responseText).data);
            },
        })
    } else if (cell.attributes.type == 'standard.Link') {
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
        let new_weak_entity_name = window.prompt("Please enter the new name of the weak entity:", "");
        elementView.model.attributes.attrs.label.text = new_weak_entity_name;
    } else if (elementView.model.attributes.type === 'myApp.StrongEntity') {
        let new_weak_strong_name = window.prompt("Please enter the new name of the strong entity:", "");
        elementView.model.attributes.attrs.label.text = new_weak_strong_name;
    } else if (elementView.model.attributes.type === 'myApp.Relationship') {
        let new_relationship_name = window.prompt("Please enter the new name of the relationship entity:", "");
        elementView.model.attributes.attrs.label.text = new_relationship_name;
    } else {

    }
    elementView.render();
})

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
        },
        magnet: false,
    
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

const relationship = dia.Element.define('myApp.Relationship', {
    attrs: {
        body: {
            width: '50',
            height: '50',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF',
            level: 2,
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
]
});

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
                                    // rect: {
                                    //     fill: {
                                    //         type: 'color-palette',
                                    //         options: options.colorPaletteReset,
                                    //         label: 'Fill',
                                    //         defaultValue: '#f6f6f6',
                                    //         index: 5,
                                    //     },
                                    //     stroke: {
                                    //         type: 'color-palette',
                                    //         options: options.colorPaletteReset,
                                    //         label: 'Outline',
                                    //         index: 6,
                                    //     },
                                    // }
                                },
                                position: {
                                    type: 'select-box',
                                    options: options.labelPosition || [],
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
                                // rect: {
                                //     fill: {
                                //         type: 'color-palette',
                                //         options: options.colorPaletteReset,
                                //         label: 'Fill',
                                //         defaultValue: '#f6f6f6',
                                //         index: 3
                                //     },
                                //     stroke: {
                                //         type: 'color-palette',
                                //         options: options.colorPaletteReset,
                                //         label: 'Outline',
                                //         index: 4
                                //     }
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
        clear: { index: 1 },
        zoom: { index: 2 },
        create: { index: 3 },
        currentSchema: { index: 4 },
        undoredo: { index: 5 },
        map: { index: 6 },
    },
    tools: [
        { type: 'button', name: 'clear', group: 'clear', text: 'Clear Diagram' },
        { type: 'button', name: 'map', group: 'map', text: 'To DDL' },
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
    'map:pointerclick': () => {

        new_ddl_request = {
            "id": schemaID
        }

        let ddl;

        $.ajax({
            async: false,
            type: "POST",
            url: "http://" + ip_address + ":8080/er/schema/export_schema_to_ddl",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(new_ddl_request),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success!");
                ddl = result.data.schemaDDL;
            },
            error: function(result) {
                is_success = false;
                alert(JSON.parse(result.responseText).data);
            },
        })

        console.log("DDL: \n", ddl);

        $.confirm({
            title: 'DDL of ' + schemaName,
            content: ddl,
            buttons: {
                confirm: function () {
                    $.alert('Confirmed!');
                },
                cancel: function () {
                    $.alert('Canceled!');
                },
                somethingElse: {
                    text: 'Download',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function(){
                        console.log("try to download!");
                        const blob = new Blob([JSON.stringify(ddl)])
                        util.downloadBlob(blob, schemaName + ".json");
                    }
                }
            }
        });

    },
    'create:pointerclick': () => {
        let new_schema_name = window.prompt("Please enter the name of the new schema:", "");
        schemaName = new_schema_name;
        request = {
            "name": new_schema_name
        }
        $.ajax({
            async: false,
            type: "POST",
            url: "http://" + ip_address + ":8080/er/schema/create",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success!");
                schemaID = result.data.id;
                console.log("create new schema with ", result.data.id);
            },
            error: function(result) {
                is_success = false;
                alert(JSON.parse(result.responseText).data);
            },
        })
        graph.clear();
        // paper.render();
    }
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
    console.log("cells: ", graph.getCells());
    if (cell.attributes.type == 'standard.Link') {
        // This is for the attributes setting; target.id == undefined means this is an attribute
        if (cell.attributes.target.id == undefined) {

            if (cell.attributes.labels) {

                const position = calculateLabelPosition(cell, "");

                cell.attributes.labels[0].position = {
                    distance: 1,
                    offset: {
                        x: position.final_x,
                        y: position.final_y
                    }
                };

                if (cell.attributes.labels[0].attrs) {

                    const original_text = cell.attributes.labels[0].attrs.text.text;
                    const source_id = cell.attributes.source.id;
                    const source = graph.getCell(source_id);
                    const belongObject = getElement(entitiesArray, source);
                    const attribute_name = original_text.includes('?') ? original_text.substring(0, original_text.length - 1) : original_text;
                    const attribute = getAttribute(belongObject, attribute_name);

                    console.log("original_text: ", original_text);
                    // This is used to set the optional
                    // if (cell.attributes.labels[0].attrs.text.optional == 'Yes') {
                    if (cell.attributes.labels[0].attrs.text.optional == 'Yes' && attribute.attributeType != 2 && !original_text.includes('?')) {

                        console.log("1111111111111111: ", cell.attributes.labels[0].attrs.text);
                        if (attribute.isPrimary) {
                            alert("This attribute is a primary key, cannot be set to optional!");
                            cell.attributes.labels[0].attrs.text.optional = 'No';
                            console.log("1111111111111111: ", cell.attributes.labels[0].attrs.text);
                            // may need to break here?
                        } else {
                            cell.attributes.labels[0].attrs.text.text = original_text.includes('?') ? original_text : original_text + "?";
                            // cell.attributes.labels[0].position.offset.x -= 8;
                            // cell.attributes.labels[0].position.offset.y -= 8;

                            // invoke api to update its optional

                            attribute_update_request = {
                                "attributeID": attribute.id,
                                "attributeType": 2,
                                // "aimPort": -1
                            }

                            $.ajax({
                                async: false,
                                type: "POST",
                                url: "http://" + ip_address + ":8080/er/attribute/update",
                                headers: { "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                                traditional : true,
                                data: JSON.stringify(attribute_update_request),
                                dataType: "json",
                                contentType: "application/json",
                                success: function(result) {
                                    alert("success to update attribute!");
                                    console.log("update attribute api result: ", result);
                                    attribute.attributeType = 2;
                                },
                                error: function(result) {
                                    is_success = false;
                                    console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                                    alert(JSON.parse(result.responseText).data);
                                },
                            });
                            console.log("cell.attributes.labels[0].attrs.text.text: ", cell.attributes.labels[0].attrs.text.text);
                        }

                    } else if (cell.attributes.labels[0].attrs.text.optional == 'No' && attribute.attributeType == 2 && original_text.includes('?')) {
                        
                        console.log("2222222222222222: ", cell.attributes.labels[0].attrs.text);
                        cell.attributes.labels[0].attrs.text.text = original_text.includes('?') ? original_text.substring(0, original_text.length - 1) : original_text;
                        // cell.attributes.labels[0].position.offset.x -= 8;
                        // cell.attributes.labels[0].position.offset.y -= 8;

                        // need to invoke api here
                        attribute_update_request = {
                            "attributeID": attribute.id,
                            "attributeType": 1,
                            // "aimPort": -1
                        }

                        $.ajax({
                            async: false,
                            type: "POST",
                            url: "http://" + ip_address + ":8080/er/attribute/update",
                            headers: { "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                            traditional : true,
                            data: JSON.stringify(attribute_update_request),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(result) {
                                alert("success to update attribute!");
                                console.log("update attribute api result: ", result);
                                attribute.attributeType = 1;
                            },
                            error: function(result) {
                                is_success = false;
                                console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                                alert(JSON.parse(result.responseText).data);
                            },
                        });
                        console.log("cell.attributes.labels[0].attrs.text.text: ", cell.attributes.labels[0].attrs.text.text);
                    }

                    // This is used to set primary key
                    // Here we need to reset the attribute name, because it may contains optional mark "?"
                    const new_attribute_name = cell.attributes.labels[0].attrs.text.text;


                    // if (cell.attributes.labels[0].attrs.text.primary) {
                    if (cell.attributes.labels[0].attrs.text.primary == 'Yes' && attribute.isPrimary == false) {
                        
                        console.log("333333333333333333: ", cell.attributes.labels[0].attrs.text);
                        if (attribute.attributeType == 2) {
                            alert("This attribute is optional, cannot be set to primary!");
                            cell.attributes.labels[0].attrs.text.primary = 'No'; // 这里需要控制下拉窗口的cache
                            // may need to break here?
                            console.log("333333333333333333: ", cell.attributes.labels[0].attrs.text);
                        } else {
                            let underline_string = "";
                            let count = 0;
                            for (char in new_attribute_name) {
                                underline_string += "_";
                                count++;
                            } 
                            cell.attributes.labels[0].attrs.outer = {
                                text: underline_string,
                                fill: "#FFFFFF"
                            }
                            cell.attributes.labels[0].markup = util.svg`<text @selector="text"/> <text @selector="outer"/>`;
                            // cell.attributes.labels[0] = {
                            //     attrs: {
                            //         text: {
                            //             text: new_attribute_name,
                            //             primary: "Yes"
                            //         },
                            //         outer: {
                            //             // stroke: '#FFFFFF',
                            //             // fill: '#FFFFFF',
                            //             text: underline_string,
                            //         },
                            //     },
                            //     markup: util.svg`<text @selector="text" fill="#FFFFFF"/> <text @selector="outer" fill="#FFFFFF"/>`,
                            //     position: {
                            //         distance: 1,
                            //         offset: {
                            //             x: position.final_x - 8,
                            //             y: position.final_y - 8
                            //         }
                            //     }
                            // }
                            
                            const source_id = cell.attributes.source.id;
                            const source = graph.getCell(source_id);
                            const belongObject = getElement(entitiesArray, source);
                            const attribute_name = cell.attributes.labels[0].attrs.text.text;

                            const attribute = getAttribute(belongObject, attribute_name);

                            attribute_update_request = {
                                "attributeID": attribute.id,
                                "isPrimary": true, // can change its value when choosing 'isPrimary'.
                                // "aimPort": -1
                            }

                            $.ajax({
                                async: false,
                                type: "POST",
                                url: "http://" + ip_address + ":8080/er/attribute/update",
                                headers: { "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                                traditional : true,
                                data: JSON.stringify(attribute_update_request),
                                dataType: "json",
                                contentType: "application/json",
                                success: function(result) {
                                    alert("success to update attribute!");
                                    console.log("update attribute api result: ", result);
                                    attribute.isPrimary = true;
                                },
                                error: function(result) {
                                    is_success = false;
                                    console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                                    alert(JSON.parse(result.responseText).data);
                                },
                            });
                        }
                        
                    } else if (cell.attributes.labels[0].attrs.text.primary == 'No' && attribute.isPrimary == true) {
                        console.log("4444444444444444: ", cell.attributes.labels[0].attrs.text);
                        cell.attributes.labels[0] = {
                            attrs: {
                                text: {
                                    text: new_attribute_name,
                                    primary: "No",
                                    optional: "No",
                                    fill: "#FFFFFF"
                                },
                            },
                            markup: util.svg`<text @selector="text"/>`,
                            position: {
                                distance: 1,
                                offset: {
                                    x: position.final_x,
                                    y: position.final_y
                                }
                            }
                        }

                        const source_id = cell.attributes.source.id;
                        const source = graph.getCell(source_id);
                        const belongObject = getElement(entitiesArray, source);
                        const attribute_name = cell.attributes.labels[0].attrs.text.text;

                        const attribute = getAttribute(belongObject, attribute_name);

                        attribute_update_request = {
                            "attributeID": attribute.id,
                            "isPrimary": false, // can change its value when choosing 'isPrimary'.
                            // "aimPort": -1
                        }

                        $.ajax({
                            async: false,
                            type: "POST",
                            url: "http://" + ip_address + ":8080/er/attribute/update",
                            headers: { "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                            traditional : true,
                            data: JSON.stringify(attribute_update_request),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(result) {
                                alert("success to update attribute!");
                                console.log("update attribute api result: ", result);
                                attribute.isPrimary = false;
                            },
                            error: function(result) {
                                is_success = false;
                                console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                                alert(JSON.parse(result.responseText).data);
                                attribute.isPrimary = true;
                            },
                        });
                    }
                    // }
                }
            }
            
            cell.attributes.attrs.line.targetMarker.d = 'M 0, 0 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0';
        } else {

            if (cell.attributes.labels) {
                cell.attributes.labels[0].position = {
                    offset: -20
                };
            }

            cell.attributes.attrs.line.targetMarker.d = 'M 0 0 0 0';

            // This is for adding a new subset
            if (cell.attributes.attrs.line.sourceMarker) {
                if (cell.attributes.attrs.line.sourceMarker.d != "M 0 0 0 0") {
                    const source_id = cell.attributes.source.id;
                    const target_id = cell.attributes.target.id;
                    const source = graph.getCell(source_id);
                    const target = graph.getCell(target_id);         

                    const source_name = source.attributes.attrs.label.text;
                    const target_name = target.attributes.attrs.label.text;
                    let belongStrongEntityID = "";
                    let target_entity_id = "";
                    for (idx in entitiesArray) {
                        if (entitiesArray[idx].name == source_name) {
                            belongStrongEntityID = entitiesArray[idx].id;
                        }
                        if (entitiesArray[idx].name == target_name) {
                            target_entity_id = entitiesArray[idx].id; 
                        }
                    }

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
                        url: "http://" + ip_address + ":8080/er/entity/delete",
                        headers: { "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                        traditional : true,
                        data: JSON.stringify(delete_request),
                        dataType: "json",
                        contentType: "application/json",
                        success: function(result) {
                            alert("success!");
                        },
                        error: function(result) {
                            is_success = false;
                            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                            alert(JSON.parse(result.responseText).data);
                        },
                    });

                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "http://" + ip_address + ":8080/er/entity/create_subset",
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
                            entitiesArray.push(new_subset);
                        },
                        error: function(result) {
                            is_success = false;
                            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                            alert(JSON.parse(result.responseText).data);
                        },
                    });
                }
            }
            
        }
    }
});

function getAttribute(belongObject, attribute_name) {
    const attributesArray = belongObject.attributesArray;
    let result;
    for (idx in attributesArray) {
        if (attributesArray[idx].name == attribute_name) {
            result = attributesArray[idx];
        }
    }
    return result;
}

paper.on('link:pointerup', (cell, evt) => {
    console.log("wellllllll");
    if (cell.model.attributes.target.id && !cell.model.attributes.labels) {

        // This is for linking relationship with entities
        const source = graph.getCell(cell.model.attributes.source.id);
        const target = graph.getCell(cell.model.attributes.target.id);

        let new_cardinality_name = window.prompt("Please enter the ratio of the new cardinality:", "");
        let cardinality;
        if (new_cardinality_name == "0:1") {
            cardinality = 1;
        } else if (new_cardinality_name == "0:N") {
            cardinality = 2;
        } else if (new_cardinality_name == "1:1") {
            cardinality = 3;
        } else if (new_cardinality_name == "1:N") {
            cardinality = 4;
        } else {
            cardinality = 0;
        } 

        // need to wrapper the api invoking function later!
        if (checkArray(entitiesArray, source) && checkArray(relationshipsArray, target)) {

            entity = getElement(entitiesArray, source);
            relation = getElement(relationshipsArray, target);

            cell.model.attributes.labels = [];
            cell.model.attributes.labels[0] = {
                attrs: {
                    text: {
                        text: new_cardinality_name,
                        // primary: "Yes"
                    },
                    outer: {
                        stroke: '#FFFFFF',
                        // fill: '#f6f6f6',
                        // fill: '#FFFFFF',
                        // text: underline_string,
                    },
                },
                // markup: util.svg`<text @selector="text" fill="#FFFFFF"/> <rect @selector="outer" fill="#f6f6f6"/>`,
                markup: util.svg`<text @selector="text" fill="#FFFFFF"/>`,
                position: {
                    offset: -15
                }
            }

            cell.render();

            if (!entity.weakEntityName) {
                new_link_obj = {
                    "relationshipID": relation.id,
                    "belongObjID": entity.id, 
                    "belongObjType": 2, // currently do not support relationship as the belongObj!
                    "cardinality": cardinality, 
                    "portAtRelationshi": -1,
                    "portAtEntity": -1,
                }
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/relationship/link_obj",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(new_link_obj),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success!");
                        new_link_obj.edgeID = result.data.edgeID;
                        console.log("api result: ", result);
                        relation.belongObjWithCardinalityList.push(new_link_obj);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });
            }
            
        } else if (checkArray(entitiesArray, target) && checkArray(relationshipsArray, source)) {

            entity = getElement(entitiesArray, target);
            relation = getElement(relationshipsArray, source);

            cell.model.attributes.labels = [];
            cell.model.attributes.labels[0] = {
                attrs: {
                    text: {
                        text: new_cardinality_name,
                        // primary: "Yes"
                    },
                    outer: {
                        stroke: '#FFFFFF',
                        // fill: '#f6f6f6',
                        // fill: '#FFFFFF',
                        // text: underline_string,
                    },
                },
                // markup: util.svg`<text @selector="text" fill="#FFFFFF"/> <rect @selector="outer" fill="#f6f6f6"/>`,
                markup: util.svg`<text @selector="text" fill="#FFFFFF"/>`,
                position: {
                    offset: 0
                }
            }

            cell.render();

            if (!entity.weakEntityName) {
                new_link_obj = {
                    "relationshipID": relation.id,
                    "belongObjID": entity.id, 
                    "belongObjType": 2, // currently do not support relationship as the belongObj!
                    "cardinality": cardinality,
                    "portAtRelationshi": -1,
                    "portAtEntity": -1,
                }
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/relationship/link_obj",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(new_link_obj),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success!");
                        new_link_obj.edgeID = result.data.edgeID;
                        console.log("api result: ", result);
                        relation.belongObjWithCardinalityList.push(new_link_obj);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });
            }
            
        }


        // Checking every sides of the link, if one side is a weak entity and the other side is a relationship, then
        // need to invkoe the api; otherwise just skip.
        // Advanced: also need to check whether there is a strong entity linking to the relationship before invoking 
        // the api; if not linking, cannot link the weak entity! (In other words, it is necessary to have a strong entity 
        // first, such that the weak entity cannot exist without its "identifying".)
        
        if (checkArray(entitiesArray, source) && checkArray(relationshipsArray, target)) {
            entity = getElement(entitiesArray, source);
            relation = getElement(relationshipsArray, target);
            if (entity.weakEntityName) {
                if (relation.belongObjWithCardinalityList.length == 0) {
                    alert("must have a strong entity exist!");
                    return;
                }
                // Currently only support one strong entity, so just use index 0.
                const strong_entity = relation.belongObjWithCardinalityList[0];

                entity.weakEntityCardinality = new_cardinality_name;
                entity.strongEntityCardinality = strong_entity.cardinality;
                entity.strongEntityID = strong_entity.belongObjID;
                entity.relationshipName = relation.name;

                delete_relationship_request = {
                    "id": relation.id
                }

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/relationship/delete",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(delete_relationship_request),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success to delete the relationship!");
                        console.log("delete relationship api result: ", result);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/entity/create_weak_entity",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(entity),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success to create a new weak entity!");
                        entity.id = result.data.weakEntityID;
                        relation.id = result.data.relationshipID;
                        console.log("api result: ", result);

                        // May have issues here, since we save link information by link object.
                        new_link_obj = {
                            "relationshipID": relation.id,
                            "belongObjID": entity.id, 
                            "belongObjType": 2, // currently do not support relationship as the belongObj!
                            "cardinality": cardinality,
                            "portAtRelationshi": -1,
                            "portAtEntity": -1,
                        }

                        // Didn't delete the original relationship object, only change its id and insert new link object.
                        relation.belongObjWithCardinalityList.push(new_link_obj);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });
            }
        } else if (checkArray(entitiesArray, target) && checkArray(relationshipsArray, source)) {
            entity = getElement(entitiesArray, target);
            relation = getElement(relationshipsArray, source);
            if (entity.weakEntityName) {
                if (relation.belongObjWithCardinalityList.length == 0) {
                    alert("must have a strong entity exist!");
                    return;
                }
                // Currently only support one strong entity, so just use index 0.
                const strong_entity = relation.belongObjWithCardinalityList[0];

                entity.weakEntityCardinality = cardinality;
                entity.strongEntityCardinality = strong_entity.cardinality;
                entity.strongEntityID = strong_entity.belongObjID;
                entity.relationshipName = relation.name;

                delete_relationship_request = {
                    "id": relation.id
                }

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/relationship/delete",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(delete_relationship_request),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success to delete the relationship!");
                        console.log("relete relationship api result: ", result);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "http://" + ip_address + ":8080/er/entity/create_weak_entity",
                    headers: { "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
                    traditional : true,
                    data: JSON.stringify(entity),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert("success to create a new weak entity!");
                        entity.id = result.data.weakEntityID;
                        relation.id = result.data.relationshipID;
                        console.log("api result: ", result);

                        // May have issues here, since we save link information by link object.
                        new_link_obj = {
                            "relationshipID": relation.id,
                            "belongObjID": entity.id, 
                            "belongObjType": 2, // currently do not support relationship as the belongObj!
                            "cardinality": cardinality,
                            "portAtRelationshi": -1,
                            "portAtEntity": -1,
                        }

                        // Didn't delete the original relationship object, only change its id and insert new link object.
                        relation.belongObjWithCardinalityList.push(new_link_obj);
                    },
                    error: function(result) {
                        is_success = false;
                        console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                        alert(JSON.parse(result.responseText).data);
                    },
                });
            }
        }

    }
}) 

function checkArray(arr, cell) {
    const cell_name = cell.attributes.attrs.label.text;
    for (idx in arr) {
        if (arr[idx].name == cell_name || arr[idx].weakEntityName) {
            return true;
        }
    }
    return false;
}

function getElement(arr, cell) {
    const cell_name = cell.attributes.attrs.label.text;
    let result;
    for (idx in arr) {
        if (arr[idx].name == cell_name || arr[idx].weakEntityName == cell_name) {
            result = arr[idx];
        }
    }
    return result;
}

function calculateLabelPosition(cell, attribute_name) {

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

    const text = attribute_name;
    // console.log(text);
    // console.log((attribute_name.length - 2) / 2);
    let final_x_offset = (-6) * ((attribute_name.length - 2) / 2) + 4; // This is used for giving left side attributes offset px to avoid too large name exceeds the area

    if (target_x >= source_x) {
        if (Math.abs(target_x - source_x) >= Math.abs(target_y - source_y)) {
            final_x = 22; // 30
            final_y = -8;
        } else {
            if (target_y <= source_y) {
                final_x = final_x_offset - 8;
                final_y = -33; // -25
            } else {
                final_x = final_x_offset - 8;
                final_y = 17; // 25
            }
        }
    } else {
        if (Math.abs(target_x - source_x) >= Math.abs(target_y - source_y)) {
            final_x = -38 + (-6) * attribute_name.length;
            final_y = -8;
        } else {
            if (target_y <= source_y) {
                final_x = final_x_offset - 8;
                final_y = -33; // -25
            } else {
                final_x = final_x_offset - 8;
                final_y = 17; // 25
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

    if (!cell.model.attributes.labels && cell.model.attributes.target.id == undefined) {
        // Here, we set the new attribute name and put it in the right place.
        let new_attribute_name = window.prompt("Please enter the name of the attribute:", "");
        const position = calculateLabelPosition(cell.model, new_attribute_name);

        if (!cell.model.attributes.labels) {
            cell.addLabel({});
        }

        // cell.addLabel({});

        // let label_index = cell.model.attributes.labels.length ? 1 : cell.model.attributes.labels.length;
        cell.model.attributes.labels[0] = {
            attrs: {
                text: {
                    text: new_attribute_name,
                    optional: "No",
                    primary: "No",
                    fill: "#FFFFFF"
                },
            },
            markup: util.svg`<text @selector="text"/>`,
            position: {
                distance: 1,
                offset: {
                    x: position.final_x,
                    y: position.final_y
                }
            }
        };

        const belongObjectGraphId = cell.model.attributes.source.id;
        const source = graph.getCell(belongObjectGraphId);
        const belongObject = getElement(entitiesArray, source);

        let belongObjType;
        if (belongObject.weakEntityName) {
            belongObjType = 2;
        } else if (belongObject.belongObjWithCardinalityList) {
            belongObjType = 3;
        } else {
            belongObjType = 2;
        }

        if (!belongObject.attributesArray) {
            belongObject.attributesArray = [];
        }
        
        new_attribute = {
            "belongObjID": belongObject.id,
            "belongObjType": belongObjType,
            "name": new_attribute_name,
            "dataType": "TEXT", // need to choose datatype in frontend; or check in the backend!
            "isPrimary": false, // can change its value when choosing 'isPrimary'.
            "attributeType": 1, // need to choose its type; when clicking isOptional, need to reset this value.
            "aimPort": -1,
            "layoutInfo": {
                "layoutX": cell.model.attributes.target.x,
                "layoutY": cell.model.attributes.target.y,
            }
        }

        $.ajax({
            async: false,
            type: "POST",
            url: "http://" + ip_address + ":8080/er/attribute/create",
            headers: { "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
            traditional : true,
            data: JSON.stringify(new_attribute),
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                alert("success to add new attribute!");
                new_attribute.id = result.data.id;
                new_attribute.graphId = cell.id;
                belongObject.attributesArray.push(new_attribute);
                console.log("attribute api result: ", result);
            },
            error: function(result) {
                is_success = false;
                console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                alert(JSON.parse(result.responseText).data);
            },
        });
    }
})

graph.on('change:level', (cell, level) => {
    const color = (level > 8) ? '#ff9580' : '#ffffff';
    cell.prop('attrs/body/fill', color);
});
