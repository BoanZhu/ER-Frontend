import * as React from 'react';

import {StencilService} from './DrawingPage/services/stencil-service';
import {ToolbarService} from './DrawingPage/services/toolbar-service';
import {InspectorService} from './DrawingPage/services/inspector-service';
import {HaloService} from './DrawingPage/services/halo-service';
import {KeyboardService} from './DrawingPage/services/keyboard-service';
import RappidService from './DrawingPage/services/kitchensink-service';


import {sampleGraphs} from './DrawingPage/config/sample-graphs';

import './css/style_drawing.css';

import './css/style.css'; 
import './css/theme-picker.css';
import './css/style.dark.css';
// import './css/style.materail.css';
import './css/style.modern.css';
import {ThemePicker} from './DrawingPage/components/theme-picker';
import * as joint from '@clientio/rappid';

interface Props {
}

interface State {
}

// namespace ThemePickerr {
 
//     export interface Options extends joint.mvc.ViewOptions<undefined> {
//         tools: Array<{ [key: string]: any }>;
//     }
 
//     export interface MainView {
//         commandManager: joint.dia.CommandManager;
//         paper: joint.dia.Paper;
//         graph: joint.dia.Graph;
//     }
// }

// export class ThemePicker extends joint.ui.Toolbar {
 
//     constructor(options: { mainView: ThemePickerr.MainView }) {

//         super({
//             ...options,
//             className: `${joint.ui.Toolbar.prototype.className} theme-picker`
//         });

//         this.mainView = options.mainView;
//     }

//     options: ThemePickerr.Options;
//     mainView: ThemePickerr.MainView;

//     init() {

//         const options = [
//             { value: 'modern', content: 'Modern' },
//             { value: 'dark', content: 'Dark' },
//             { value: 'material', content: 'Material' }
//         ];

//         const themes = {
//             type: 'select-button-group',
//             name: 'theme-picker',
//             multi: false,
//             selected: options.findIndex(option => option.value === this.defaultTheme),
//             options,
//             attrs: {
//                 '.joint-select-button-group': {
//                     'data-tooltip': 'Change Theme',
//                     'data-tooltip-position': 'bottom'
//                 }
//             }
//         };

//         this.options.tools = [themes];
//         this.on('theme-picker:option:select', this.onThemeSelected, this);

//         super.init();
//     }

//     onThemeSelected(option: any) {

//         joint.setTheme(option.value);
//         if (this.mainView) {
//             this.adjustAppToTheme(this.mainView, option.value);
//         }
//     }

//     adjustAppToTheme(app: ThemePickerr.MainView, theme: string) {


//         // Make the following changes silently without the command manager notice.
//         app.commandManager.stopListening();

//         // Links in the dark theme would not be visible on the dark background.
//         // Note that this overrides custom color
//         const linkColor = (theme === 'dark' ? '#f6f6f6' : '#222138');

//         const themedLinks = app.graph.getLinks();
//         const defaultLink = app.paper.options.defaultLink;
//         if (defaultLink instanceof joint.dia.Link) {
//             themedLinks.push(defaultLink);
//         }

//         themedLinks.forEach(function(link: joint.dia.Link) {
//             link.attr({
//                 '.connection': { 'stroke': linkColor },
//                 '.marker-target': { 'fill': linkColor },
//                 '.marker-source': { 'fill': linkColor }
//             });
//         });

//         // Material design has no grid shown.
//         if (theme === 'material') {
//             app.paper.options.drawGrid = false;
//             app.paper.clearGrid();
//         } else {
//             app.paper.options.drawGrid = true;
//             app.paper.drawGrid();
//         }

//         app.commandManager.listen();
//     }
// }

class Rappid extends React.Component<Props, State> {

    private rappid: RappidService;
    private elementRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
    }

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
            
        // const themePicker = new ThemePicker({ mainView: this.rappid }).render().$el.appendTo(document.body);
        // var themePicker;

        // this.themePicker = new ThemePicker({ mainView: this.rappid });
        // let themePicker = new ThemePicker({ mainView: this.rappid });
        // themePicker.$el.appendTo(document.body);
        // console.log(themePicker.render())

        this.rappid.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));
    }

    // componentDidUpdate() {
    //     const themePicker = new ThemePicker({ mainView: this.rappid });
    // }

    render() {

        return (
            <div>
            <div ref={this.elementRef} className="joint-app joint-theme-modern">
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
            </div>
        );
    }
}

export default Rappid;
