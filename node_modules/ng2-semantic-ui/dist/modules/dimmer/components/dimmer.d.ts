import { EventEmitter, Renderer2, ElementRef, ChangeDetectorRef } from "@angular/core";
import { SuiTransition } from "../../transition";
export declare class SuiDimmer extends SuiTransition {
    private _dimmerClasses;
    private _transitionController;
    private _isDimmed;
    isDimmed: boolean;
    isDimmedChange: EventEmitter<boolean>;
    isClickable: boolean;
    transition: string;
    transitionDuration: number;
    constructor(renderer: Renderer2, element: ElementRef, changeDetector: ChangeDetectorRef);
    private onClick();
}
