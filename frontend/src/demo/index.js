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

// let schemaID = "";
let schemaID = "1133";
let schemaName = "Test schema";

// --------------------- Paper & PaperScroller ---------------------

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

// --------------------- Paper & PaperScroller End ---------------------



// ------------ Custom Shape ------------

// This is an example shape
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

// another example shape
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

const StrongEntity = dia.Element.define('myApp.StrongEntity', {
        
    // body: {
    //     width: '50',
    //     height: '50',
    //     strokeWidth: 2,
    //     stroke: '#000000',
    //     fill: '#FFFFFF',
    //     level: 2,
    // },
    // text: {
    //     // text: 'Relation',
    //     x: '25',
    //     y: '25',
    //     fontSize: 14,
    //     textAnchor: 'middle',
    //     textVerticalAnchor: 'middle',
    //     fontFamily: 'Roboto Condensed',
    //     fontWeight: 'Normal',
    //     fill: '#00879b',
    //     strokeWidth: 0
    // }
    attrs: {
        body: {
            width: '100',
            height: '50',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF',
            level: 1,
            // magnet: false, // cannot add this field, or there will have bug
            // event: 'StrongEntity:delete', // can add event inside the body
        },
        label: {
            x: '50',
            y: '25',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontSize: 14,
            fill: '#00879b',
            level: 2,
            event: 'StrongEntity:delete',
        },
        // event: 'StrongEntity:delete',
    },
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }]
});

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
    },
}, {
    // <path d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z" />
    markup: util.svg`
        <rect @selector="body" transform='rotate(45, 25, 25)' />
        <text @selector="label" x="0" y="15" fill="red" />
    `
})

const generalization = dia.Element.define('myApp.Generalization', {
    attrs: {
        body: {
            width: '50',
            height: '50',
            strokeWidth: 2,
            stroke: 'grey',
            fill: '#FFFFFF',
            level: 2,
        },
        text: {
            // text: 'Relation',
            x: '80',
            y: '40',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontFamily: 'Roboto Condensed',
            fontWeight: 'Normal',
            fill: '#00879b',
            strokeWidth: 0
        },
        label: {
            text: "generalization",
        }
    },
    ports: {
        groups: {
            'inPort': {
                markup: util.svg`<circle @selector="portBody"/>`,
                z: -1,
                attrs: {
                    portBody: {
                        r: 8,
                        magnet: true,
                        fill: '#00879b'
                    }
                },
                position: { 
                    name: 'inPort',
                    args: {
                        x: 80,
                        y: 0
                    }
                },
                // label: { position: { name: 'n' }}
            },
            'out1': {
                markup: util.svg`<circle @selector="portBody"/>`,
                z: -1,
                attrs: {
                    portBody: {
                        r: 8,
                        magnet: true,
                        fill: '#00879b'
                    }
                },
                position: { 
                    name: 'outPort1',
                    args: {
                        x: 0,
                        y: 100
                    }
                },
                // label: { position: { name: 'n' }}
            },
            'out2': {
                markup: util.svg`<circle @selector="portBody"/>`,
                z: -1,
                attrs: {
                    portBody: {
                        r: 8,
                        magnet: true,
                        fill: '#00879b'
                    }
                },
                position: { 
                    name: 'right',
                    args: {
                        x: 160,
                        y: 100
                    }
                },
                // label: { position: { name: 'right' }}
            }
        }
    }
}, {
    // <path @selector="body" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z" />
    markup: util.svg`
        <path @selector="body" d="M 80 0 V 0 H 80 V 20 L 60 20 L 40 40 L 60 60 H 100 L 120 40 L 100 20 H 80 M 80 60 V 80 M 80 80 H 160 H 0 M 160 100 V 80 M 0 100 V 80" stroke="blue" />
        <text @selector="label" x="0" y="15" fill="red" />
    `
})

// ------------ Custom Shape End ------------



// ------- Stencil -------

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
        attrs: { label: { text: 'Entity' }},
    }, {
        type: 'myApp.WeakEntity',
        attrs: { label: { text: 'WeakEntity' }}
    }, {
        type: 'myApp.Relationship',
        attrs: { 
            label: { 
                text: 'Relation' 
            } 
        },
    }, {
        type: 'myApp.Generalization',
        ports: { items: [{ id: 'in1', group: 'inPort' }, { group: 'out1', id: 'out1' }, { group: 'out2', id: 'out2' }] }
    }, 
    // {
    //     type: 'myApp.MyShape',
    //     ports: { items: [{ id: 'in1', group: 'in' }, { group: 'out', id: 'out1' }] }
    // }
]
});

// ------- Stencil End -------



// -------- Inspector --------

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
    ],
    dataType: [
        { text: "UNKNOWN", content: 'UNKNOWN' },
        { text: "CHAR", content: 'CHAR' },
        { text: "VARCHAR", content: 'VARCHAR' },
        { text: "TEXT", content: 'TEXT' },
        { text: "TINYINT", content: 'TINYINT' },
        { text: "SMALLINT", content: 'SMALLINT' },
        { text: "INT", content: 'INT' },
        { text: "BIGINT", content: 'BIGINT' },
        { text: "FLOAT", content: 'FLOAT' },
        { text: "DOUBLE", content: 'DOUBLE' },
        { text: "DATETIME", content: 'DATETIME' },
    ]
}

paper.on('element:pointerclick link:pointerclick', (elementView, evt) => {
    if (elementView.model.attributes.type == "standard.Link") {
        console.log("link: ", elementView);
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
                                        dataType: {
                                            type: 'select-box',
                                            defaultValue: 'TEXT',
                                            options: options.dataType || [],
                                            label: 'Data Type',
                                            index: 4,
                                        }
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
        console.log("not link: ", elementView);
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

// -------- Inspector End --------



// ---- Halo ----

paper.on('element:pointerclick', (elementView) => {
    const handles = [{
        name: 'remove',
        position: 'nw',
        events: { pointerup: 'removeElement',
                
                }
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

    halo.on('action:remove:pointerdown', (evt, cellView, wtf) => {
        console.log(elementView);
        if (elementView.model.attributes.type == "myApp.StrongEntity") {
            const source = graph.getCell(elementView.model.id);
            const entity = getElement(entitiesArray, source);
            const entity_delete_request = {
                id: entity.id
            }
            
            // invoke 'er/entity/delete' api
            entityDelete(entity_delete_request);

        } else {
            const source = graph.getCell(elementView.model.id);
            const relationship = getElement(relationshipsArray, source);
            const relationship_delete_request = {
                id: relationship.id
            }

            // invoke 'er/relationship/delete' api
            relationshipDelete(relationship_delete_request, relationship);
        }
    });

    halo.on('action:link:pointerup', (linkView, evt, evt2) => {

    });
});

// ---- Halo End ----



// ---------- Link Tools ----------

paper.on('link:pointerclick', (linkView) => {
    console.log("link2: ", linkView);
    paper.removeTools();
    const toolsView = new dia.ToolsView({
        tools: [
            new linkTools.Vertices(),
            new linkTools.SourceArrowhead(),
            new linkTools.TargetArrowhead(),
            new linkTools.Segments,
            new linkTools.Remove({ offset: -20, 
                distance: 40, 
                action: function(evt, linkView, toolView) {
                    linkView.model.remove({ ui: true, tool: toolView.cid });
                    
                    const attribute_name = linkView.model.attributes.labels[0].attrs.text.text;
                    const source_graph_id = linkView.model.attributes.source.id;
                    const result = graph.getCell(source_graph_id);
                    const source = getElement(entitiesArray, result);
                    const attribute = getAttribute(source, attribute_name);
                    const attribute_delete_request = {
                        id: attribute.id
                    }
                    
                    // invoke 'er/attribute/delete' api
                    attributeDelete(attribute_delete_request, source, attribute);
            }})
        ]
    });
    linkView.addTools(toolsView);
});

// ---------- Link Tools End ----------



// ------- Toolbar -------

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
        if (new_schema_name) {
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
    }
});

document.querySelector('.toolbar-container').appendChild(toolbar.el);
toolbar.render();

// ------- Toolbar End -------



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

// Working With Diagrams Programmatically End



// ----------------- All Events ----------------- 
// React on changes in the graph.
// graph.on('change add remove', (cell) => {
graph.on('change add', (cell) => {
    // console.log("cells: ", graph.getCells());
    // console.log(cell);
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

                    console.log("attribute: ", attribute);
                    console.log("cell.attributes.labels[0].attrs: ", cell.attributes.labels[0].attrs);

                    console.log("original_text: ", original_text);
                    // This is used to set the optional

                    if (cell.attributes.labels[0].attrs.text.dataType && cell.attributes.labels[0].attrs.text.dataType != attribute.dataType) {
                        attribute_update_request = {
                            "attributeID": attribute.id,
                            "dataType": cell.attributes.labels[0].attrs.text.dataType
                            // "aimPort": -1
                        }

                        // invoke 'er/attribute/update' api
                        // attributeUpdate(attribute_update_request, attribute, cell);

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
                                alert("success to update attribute dataType!");
                                console.log("update attribute api result: ", result);
                                attribute.dataType = cell.attributes.labels[0].attrs.text.dataType;
                            },
                            error: function(result) {
                                is_success = false;
                                console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
                                alert(JSON.parse(result.responseText).data);
                            },
                        });
                    }

                    if (cell.attributes.labels[0].attrs.text.optional == 'Yes' && attribute.attributeType != 2 && !original_text.includes('?')) {

                        if (attribute.isPrimary) {
                            alert("This attribute is a primary key, cannot be set to optional!");
                            cell.attributes.labels[0].attrs.text.optional = 'No';
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

                            // invoke 'er/attribute/update' api
                            // attributeUpdate(attribute_update_request, attribute, cell);

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
                        }

                    } else if (cell.attributes.labels[0].attrs.text.optional == 'No' && attribute.attributeType == 2 && original_text.includes('?')) {
                        
                        cell.attributes.labels[0].attrs.text.text = original_text.includes('?') ? original_text.substring(0, original_text.length - 1) : original_text;
                        // cell.attributes.labels[0].position.offset.x -= 8;
                        // cell.attributes.labels[0].position.offset.y -= 8;

                        // need to invoke api here
                        attribute_update_request = {
                            "attributeID": attribute.id,
                            "attributeType": 1,
                            // "aimPort": -1
                        }

                        // invoke 'er/attribute/update' api
                        // attributeUpdate(attribute_update_request, attribute, cell);

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
                    }

                    // This is used to set primary key
                    // Here we need to reset the attribute name, because it may contains optional mark "?"
                    const new_attribute_name = cell.attributes.labels[0].attrs.text.text;

                    // if (cell.attributes.labels[0].attrs.text.primary) {
                    if (cell.attributes.labels[0].attrs.text.primary == 'Yes' && attribute.isPrimary == false) {
                        
                        if (attribute.attributeType == 2) {
                            alert("This attribute is optional, cannot be set to primary!");
                            cell.attributes.labels[0].attrs.text.primary = 'No'; // 这里需要控制下拉窗口的cache
                            // may need to break here?
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

                            // invoke 'er/attribute/update' api
                            // attributeUpdate(attribute_update_request, attribute, cell);

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

                        // invoke 'er/attribute/update' api
                        // attributeUpdate(attribute_update_request, attribute, cell);

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

                    subset_create_request = {
                        "schemaID": schemaID,
                        "subsetName": target_name,
                        "belongStrongEntityID": belongStrongEntityID,
                        "aimPort": -1,
                        "layoutInfo": {
                            "layoutX": target.attributes.position.x,
                            "layoutY": target.attributes.position.y
                        }
                    };

                    entity_delete_request = {
                        "id": target_entity_id
                    };

                    // invoke 'er/entity/delete' api
                    entityDelete(entity_delete_request);

                    // invoke 'er/entity/create_subset' api
                    entityCreateSubset(subset_create_request);
                    
                }
            }
            
        }
    }
});

paper.on('blank:pointerdown', (evt) => {
    paper.removeTools();
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

graph.on('add', function(cell) { 
    if (cell.attributes.type === 'myApp.WeakEntity') {
        let new_weak_entity_name = window.prompt("Please enter the name of the new weak entity:", "");
        if (!new_weak_entity_name) {
            graph.removeCells(cell);
        } else {
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
        }
        
    } else if (cell.attributes.type === 'myApp.StrongEntity') {
        
        let new_strong_entity_name = window.prompt("Please enter the name of the new strong entity:", "");
        if (!new_strong_entity_name) {
            graph.removeCells(cell);
        } else {
            strong_entity_create_request = {
                "schemaID": schemaID,
                "name": new_strong_entity_name,
                "layoutInfo": {
                    "layoutX": cell.attributes.position.x,
                    "layoutY": cell.attributes.position.y
                }
            }
            cell.attributes.attrs.label.text = new_strong_entity_name;

            // invoke 'er/entity/create_strong' api
            entityCreateStrong(strong_entity_create_request, cell);
            
        }
        
    } else if (cell.attributes.type === 'myApp.Relationship') {
        let new_relationship_name = window.prompt("Please enter the name of the new relationship:", "");
        if (!new_relationship_name) {
            graph.removeCells(cell);
        } else {
            relationship_create_request = {
                "schemaID": schemaID,
                "name": new_relationship_name,
                "layoutInfo": {
                    "layoutX": cell.attributes.position.x,
                    "layoutY": cell.attributes.position.y
                }
            }
            cell.attributes.attrs.label.text = new_relationship_name;

            // invoke 'er/relationship/create_nary' api
            relationshipCreateNary(relationship_create_request, cell);

        }
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
    console.log("elementView: ", elementView);
    const source = graph.getCell(elementView.model.id);
    console.log("source: ", source);
    if (elementView.model.attributes.type === 'myApp.WeakEntity') {
        let new_weak_entity_name = window.prompt("Please enter the new name of the weak entity:", "");
        const entity = getElement(entitiesArray, source);

        entity_update_request = {
            "entityID": entity.id,
            "name": new_weak_entity_name
        }

        // invoke 'er/entity/update' api
        entityUpdate(entity_update_request, entity, new_weak_entity_name, elementView);
        
    } else if (elementView.model.attributes.type === 'myApp.StrongEntity') {
        let new_strong_entity_name = window.prompt("Please enter the new name of the strong entity:", "");
        const entity = getElement(entitiesArray, source);

        entity_update_request = {
            "entityID": entity.id,
            "name": new_strong_entity_name
        }

        // invoke 'er/entity/update' api
        entityUpdate(entity_update_request, entity, new_weak_entity_name, elementView);

    } else if (elementView.model.attributes.type === 'myApp.Relationship') {
        let new_relationship_name = window.prompt("Please enter the new name of the relationship entity:", "");
        const relationship = getElement(relationshipsArray, source);

        relationship_update_request = {
            "relationshipID": relationship.id,
            "name": new_relationship_name
        }

        // invoke 'er/relationship/update' api
        relationshipUpdate(relationship_update_request, relationship, new_relationship_name, elementView);
        
    } else {

    }
    elementView.render();
})

paper.on('blank:pointerdown', (evt) => {
    // Start panning the paper on mousedown
    // evt.stopPropagation();
    paperScroller.startPanning(evt);
});

paper.on('link:pointerup', (cell, evt) => {
    console.log("link3: ", cell);
    if (cell.model.attributes.target.id && !cell.model.attributes.labels) {

        // This is for linking relationship with entities
        const source_id = cell.model.attributes.source.id;
        const target_id = cell.model.attributes.target.id;
        const source = graph.getCell(source_id);
        const target = graph.getCell(target_id);

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
            cardinality = 0; // not a valid cardinality or didn't give a cardinality
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
                link_obj_request = {
                    "relationshipID": relation.id,
                    "belongObjID": entity.id, 
                    "belongObjType": 2, // currently do not support relationship as the belongObj!
                    "cardinality": cardinality, 
                    "portAtRelationshi": -1,
                    "portAtEntity": -1,
                }

                // invoke 'er/relationship/link_obj' api
                relationshipLinkObj(link_obj_request, relation);
                
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
                link_obj_request = {
                    "relationshipID": relation.id,
                    "belongObjID": entity.id, 
                    "belongObjType": 2, // currently do not support relationship as the belongObj!
                    "cardinality": cardinality,
                    "portAtRelationshi": -1,
                    "portAtEntity": -1,
                }

                // invoke 'er/relationship/link_obj' api
                relationshipLinkObj(link_obj_request, relation);
                
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

                relationship_delete_request = {
                    "id": relation.id
                }

                // invoke 'er/relationship/delete' api
                relationshipDelete(relationship_delete_request, relation);

                // invoke 'er/entity/create_weak_entity' api
                entityCreateWeak(entity, relation);
                
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

                relationship_delete_request = {
                    "id": relation.id
                }

                // invoke 'er/relationship/delete' api
                relationshipDelete(relationship_delete_request, relation);

                // invoke 'er/entity/create_weak_entity' api
                entityCreateWeak(entity, relation);
            }
        }

        // Here try to add new generalisations. The idea is that we need to check whether the generalisation's source (parent)
        // entity is connected, if it does, then we can invoke the api to add a new subset under this generalisation. 
        // Note that we don't need to do anything when the source is a strong entity and the target is the generalisation object.
        // We only need to check when the source is the generalisation and the target is an entity. And in this case, if there is 
        // no strong entity, there should not have a link and the backend should report "cannot have a generalisation without a 
        // strong entity".

        if (source.attributes.type == "myApp.Generalization" && target.attributes.type == "myApp.StrongEntity") {

            // now we need to check whether the "inPort" of the generalisation object is already connected by a strong entity.
            const belongStrongEntity_graph_id = checkInPortConnected(source_id);
            if (belongStrongEntity_graph_id) {

                const belongStrongEntity_graph_object = graph.getCell(belongStrongEntity_graph_id);
                const belongStrongEntity = getElement(entitiesArray, belongStrongEntity_graph_object);
                const targetStrongEntity = getElement(entitiesArray, target);

                console.log("belongStrongEntity_graph_object: ", belongStrongEntity_graph_object);
                console.log("belongStrongEntity: ", belongStrongEntity);
                const entity_generalisation_create_request = {
                    "schemaID": schemaID,
                    "subsetName": target.attributes.attrs.label.text,
                    "belongStrongEntityID": belongStrongEntity.id,
                    "aimPort": -1,
                    "layoutInfo": {
                        "layoutX": target.attributes.position.x,
                        "layoutY": target.attributes.position.y
                    }
                }

                const entity_delete_request = {
                    "id": targetStrongEntity.id,
                }
                
                // invoke 'er/entity/delete' api
                entityDelete(entity_delete_request);

                // invoke 'er/entity/create_generalisation' api
                entityCreateGeneralisation(entity_generalisation_create_request, targetStrongEntity);
                
            }
        }
        // console.log("cellllll: ", cell);
        // console.log("source: ", source);
        // console.log("target: ", target);
    }
}) 

paper.on('link:pointerup', (cell, evt) => {
    console.log("link4: ", cell);

    if (!cell.model.attributes.labels && cell.model.attributes.target.id == undefined) {
        // Here, we set the new attribute name and put it in the right place.
        let new_attribute_name = window.prompt("Please enter the name of the attribute:", "");
        if (!new_attribute_name) {
            graph.removeCells(cell.model);
        } else {
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
            
            attribute_create_request = {
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

            // invoke 'er/attribute/create' api
            attributeCreate(attribute_create_request, belongObject, cell);

        }
        
    }
})

graph.on('change:level', (cell, level) => {
    const color = (level > 8) ? '#ff9580' : '#ffffff';
    cell.prop('attrs/body/fill', color);
});

// ----------------- All Events End ----------------- 



// ----------------- All Helper functions -----------------

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

function removeAttribute(attributesArray, attribute) {
    for (idx in attributesArray) {
        if (attributesArray[idx].name == attribute.name) {
            // delete attributesArray[idx];
            attributesArray.splice(idx, idx);
        }
    }
}

function removeElement(array, entity) {
    for (idx in array) {
        if (array[idx].name == entity.name) {
            array.splice(idx, 1);
        }
    }
}

function checkInPortConnected(generalisation_id) {
    const cells = graph.getCells();
    let belongStrongEntity_graph_id;
    for (idx in cells) {
        if (cells[idx].attributes.type == "standard.Link" && cells[idx].attributes.target.id == generalisation_id) {
            if (cells[idx].attributes.target.port == "in1") {
                belongStrongEntity_graph_id = cells[idx].attributes.source.id;
            }
        }
    }
    return belongStrongEntity_graph_id;
}

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
    console.log("cell_name: ", cell_name);
    let result;
    for (idx in arr) {
        console.log("arr[idx].name: ", arr[idx].name);
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

// ----------------- All Helper Functions End -----------------



// ----------------- All Api Invoking Functions -----------------

function attributeCreate(attribute_create_request, belongObject, cell) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/attribute/create",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(attribute_create_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to add new attribute!");
            attribute_create_request.id = result.data.id;
            attribute_create_request.graphId = cell.id;
            belongObject.attributesArray.push(attribute_create_request);
            console.log("attribute api result: ", result);
        },
        error: function(result) {
            is_success = false;
            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
            graph.removeCells(cell.model);
        },
    });
}

function attributeUpdate(attribute_update_request, attribute, cell) {
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
            alert("success to update attribute dataType!");
            console.log("update attribute api result: ", result);
            attribute.dataType = cell.attributes.labels[0].attrs.text.dataType;
        },
        error: function(result) {
            is_success = false;
            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
        },
    });
}

function attributeDelete(attribute_delete_request, source, attribute) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/attribute/delete",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(attribute_delete_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to delete the attribute!");
            removeAttribute(source.attributesArray, attribute);
        },
        error: function(result) {
            is_success = false;
            alert("fail to delete the attribute!");
            alert(JSON.parse(result.responseText).data);
        },
    })
}

function entityDelete(entity_delete_request) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/entity/delete",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(entity_delete_request),
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
}

function relationshipDelete(relationship_delete_request, relationship) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/relationship/delete",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(relationship_delete_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to delete the relationship!");
            removeElement(relationshipsArray, relationship);
        },
        error: function(result) {
            is_success = false;
            alert("fail to delete the relationship!");
            alert(JSON.parse(result.responseText).data);
        },
    })
}

function entityCreateSubset(subset_create_request) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/entity/create_subset",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(subset_create_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
            subset_create_request.id = result.data.id;
            console.log(subset_create_request);
            entitiesArray.push(subset_create_request);
        },
        error: function(result) {
            is_success = false;
            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
        },
    });
}

function entityCreateStrong(strong_entity_create_request, cell) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/entity/create_strong",
        // url: "http://10.187.204.209:8080/er/entity/create_strong",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(strong_entity_create_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
            strong_entity_create_request.id = result.data.id;
            entitiesArray.push(strong_entity_create_request);
        },
        error: function(result) {
            is_success = false;
            console.log("Strong entity result: ", result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
            graph.removeCells(cell);
        },
    });
}

function relationshipCreateNary(relationship_create_request, cell) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/relationship/create_nary",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(relationship_create_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
            console.log("relationship result: ", result);
            relationship_create_request.id = result.data.id;
            relationship_create_request.belongObjWithCardinalityList = [];
            relationshipsArray.push(relationship_create_request);
        },
        error: function(result) {
            is_success = false;
            alert(JSON.parse(result.responseText).data);
            graph.removeCells(cell);
        },
    })
}

function entityUpdate(entity_update_request, entity, new_weak_entity_name, elementView) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/entity/update",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(entity_update_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to update the weak entity!");
            elementView.model.attributes.attrs.label.text = new_weak_entity_name;
            entity.weakEntityName = new_weak_entity_name;
        },
        error: function(result) {
            is_success = false;
            alert("fail to update the attribute!");
            alert(JSON.parse(result.responseText).data);
        }
    })
}

function relationshipUpdate(update_relationship_request, relationship, new_relationship_name, elementView) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/relationship/update",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(update_relationship_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to update the relationship!");
            elementView.model.attributes.attrs.label.text = new_relationship_name;
            relationship.name = new_relationship_name;
        },
        error: function(result) {
            is_success = false;
            alert("fail to update the attribute!");
            alert(JSON.parse(result.responseText).data);
        },
    })
}

function relationshipLinkObj(link_obj_request, relationship) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/relationship/link_obj",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(link_obj_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success!");
            link_obj_request.edgeID = result.data.edgeID;
            console.log("api result: ", result);
            relationship.belongObjWithCardinalityList.push(link_obj_request);
        },
        error: function(result) {
            is_success = false;
            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
        },
    });
}

function entityCreateWeak(entity, relation) {
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

function entityCreateGeneralisation(entity_generalisation_create_request, targetStrongEntity) {
    $.ajax({
        async: false,
        type: "POST",
        url: "http://" + ip_address + ":8080/er/entity/create_generalisation",
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
        traditional : true,
        data: JSON.stringify(entity_generalisation_create_request),
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            alert("success to create a new generalisation subset!");
            targetStrongEntity.id = result.data.id;
            console.log("api result: ", result);
        },
        error: function(result) {
            is_success = false;
            console.log(result.responseText); // It's a string but actually a JSON, so using JSON.parse 
            alert(JSON.parse(result.responseText).data);
        },
    });
}

// ----------------- All Api Invoking Functions End -----------------
