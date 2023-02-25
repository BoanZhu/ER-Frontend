import * as joint from '@clientio/rappid';

export namespace ThemePicker {

    export interface Options extends joint.mvc.ViewOptions<undefined> {
        tools: Array<{ [key: string]: any }>;
    }

    export interface MainView {
        commandManager: joint.dia.CommandManager;
        paper: joint.dia.Paper;
        graph: joint.dia.Graph;
    }
}
