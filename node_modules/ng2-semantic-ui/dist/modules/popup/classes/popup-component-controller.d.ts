import { ElementRef, Type } from "@angular/core";
import { SuiComponentFactory } from "../../../misc/util";
import { SuiPopupController } from "./popup-controller";
import { PopupConfig } from "./popup-config";
export declare class SuiPopupComponentController<T> extends SuiPopupController {
    private _component;
    private _contentComponentRef?;
    readonly componentInstance: T | undefined;
    constructor(element: ElementRef, componentFactory: SuiComponentFactory, _component: Type<T>, config: PopupConfig);
    open(): void;
}
