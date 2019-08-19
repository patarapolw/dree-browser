import "./dree-browser.scss";
import { Dree } from "dree";
export interface IDreeBrowserOptions {
    colWidth?: number;
    fileContentWidth?: number;
    on?: {
        file?: (d: Dree) => void;
        folder?: (d: Dree) => void;
    };
    fileContent?: (d: Dree) => string;
    iconPath?: string;
}
export default class DreeBrowser {
    private el;
    private dree;
    private options;
    constructor(el: HTMLElement, dree: Dree, options?: IDreeBrowserOptions);
    private buildColumn;
    private addOrReplaceColumn;
}
