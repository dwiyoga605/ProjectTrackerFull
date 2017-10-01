import { ElementRef, OnDestroy } from "@angular/core";
import { SuiComponentFactory } from "../../../misc/util";
import { PopupConfig } from "./popup-config";
import { SuiPopup } from "../components/popup";
export interface IPopup {
    open(): void;
    close(): void;
    toggle(): void;
}
export declare abstract class SuiPopupController implements IPopup, OnDestroy {
    protected _element: ElementRef;
    protected _componentFactory: SuiComponentFactory;
    private _componentRef;
    readonly popup: SuiPopup;
    private _openingTimeout;
    constructor(_element: ElementRef, _componentFactory: SuiComponentFactory, config: PopupConfig);
    openDelayed(): void;
    open(): void;
    close(): void;
    toggleDelayed(): void;
    toggle(): void;
    private onMouseEnter();
    private onMouseLeave();
    private onClick();
    onDocumentClick(e: MouseEvent): void;
    private onFocusIn();
    private onFocusOut();
    ngOnDestroy(): void;
}
