import React, { useEffect, useRef } from 'react';
import { dia, shapes, ui } from '@clientio/rappid';
import './styles/App.css'; 

function App() {
    const canvas: any = useRef(null);

    useEffect(() => {
        const graph = new dia.Graph({}, { cellNamespace: shapes });
        const paper = new dia.Paper({
            model: graph,
            background: {
                color: '#F8F9FA',
            },
            frozen: true,
            async: true,
            sorting: dia.Paper.sorting.APPROX,
            cellViewNamespace: shapes
        });

        const scroller = new ui.PaperScroller({
            paper,
            autoResizePaper: true,
            cursor: 'grab'
        });

        canvas.current.appendChild(scroller.el);
        scroller.render().center();

        const rect = new shapes.standard.Rectangle({
            position: { x: 100, y: 100 },
            size: { width: 100, height: 50 },
            attrs: {
                label: {
                    text: 'Hello World'
                }
            }
        });

        graph.addCell(rect);
        paper.unfreeze();

        return () => {
            scroller.remove();
            paper.remove();
        };

  }, []);

  return (
    //   <head>
    //     <meta charset="utf-8">
    //     <link rel="stylesheet" href="../../build/package/rappid.css" />
    //   <link rel="stylesheet" href="./style.css" />
    //   </head>
    // <body>
    //   <div class="toolbar-container"></div>
    //   <div class="stencil-container"></div>
    //   <div class="paper-container"></div>
    //   <div class="inspector-container"></div>
  
    //   {/* <!-- JointJS+ dependencies: --> */}
    //   <script src="../../node_modules/jquery/dist/jquery.js"></script>
    //   <script src="../../node_modules/lodash/lodash.js"></script>
    //   <script src="../../node_modules/backbone/backbone.js"></script>
    //   <script src="../../node_modules/graphlib/dist/graphlib.core.js"></script>
    //   <script src="../../node_modules/dagre/dist/dagre.core.js"></script>
  
    //   <script src="../../build/package/rappid.js"></script>
    //   <script src="./index.js"></script>
    // </body>
    <body>
        <div className="canvas" ref={canvas}/>

    </body>
    
  );
}

export default App;
