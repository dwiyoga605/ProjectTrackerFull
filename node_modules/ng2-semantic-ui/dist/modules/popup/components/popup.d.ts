import { ViewContainerRef, ElementRef, EventEmitter } from "@angular/core";
import { PositioningService, IDynamicClasses } from "../../../misc/util";
import { TransitionController } from "../../transition";
import { IPopup } from "../classes/popup-controller";
import { PopupConfig } from "../classes/popup-config";
export declare class SuiPopup implements IPopup {
    elementRef: ElementRef;
    config: PopupConfig;
    transitionController: TransitionController;
    positioningService: PositioningService;
    private _isOpen;
    private _closingTimeout;
    onOpen: EventEmitter<void>;
    onClose: EventEmitter<void>;
    readonly isOpen: boolean;
    private _container;
    anchor: ElementRef;
    readonly direction: string | undefined;
    readonly alignment: string | undefined;
    readonly dynamicClasses: IDynamicClasses;
    templateSibling: ViewContainerRef;
    constructor(elementRef: ElementRef);
    open(): void;
    toggle(): void;
    close(): void;
    onMouseDown(e: MouseEvent): void;
    onClick(event: MouseEvent): void;
}
