import * as React from 'react';

import {StencilService} from './DrawingPage/services/stencil-service';
import {ToolbarService} from './DrawingPage/services/toolbar-service';
import {InspectorService} from './DrawingPage/services/inspector-service';
import {HaloService} from './DrawingPage/services/halo-service';
import {KeyboardService} from './DrawingPage/services/keyboard-service';
import RappidService from './DrawingPage/services/kitchensink-service';

import {ThemePicker} from './DrawingPage/components/theme-picker';
import {sampleGraphs} from './DrawingPage/config/sample-graphs';

import './css/style.css'; 
// import './css/theme-picker.css'
// import './css/style.dark.css'
// import './css/style.materail.css'
// import './css/style.modern.css'

interface Props {
}

interface State {
}

class Rappid extends React.Component<Props, State> {

    private rappid: RappidService;
    private elementRef = React.createRef<HTMLDivElement>();

    // constructor(props: Props) {
    //     super(props);
    // }

    componentDidMount() {

        this.rappid = new RappidService(
            this.elementRef.current as HTMLDivElement,
            new StencilService(),
            new ToolbarService(),
            new InspectorService(),
            new HaloService(),
            new KeyboardService()
        );

        this.rappid.startRappid();
            
        // new ThemePicker({ mainView: this.rappid }).render().$el.appendTo(document.body);
        // themePicker.render().$el.appendTo(document.body);

        this.rappid.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));
    }

    render() {

        return (
            <div id="app" ref={this.elementRef} className="joint-app joint-theme-modern">
                <div className="app-header">
                    <div className="app-title">
                        <h1>ER ToolKit</h1>
                    </div>
                    <div className="toolbar-container"/>
                </div>
                <div className="app-body">
                    <div className="stencil-container"/>
                    <div className="paper-container"/>
                    <div className="inspector-container"/>
                    <div className="navigator-container"/>
                </div>
            </div>
        );
    }
}

export default Rappid;
