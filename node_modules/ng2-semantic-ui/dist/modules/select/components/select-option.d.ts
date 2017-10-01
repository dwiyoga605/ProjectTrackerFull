import { EventEmitter, ViewContainerRef, Renderer2, ElementRef } from "@angular/core";
import { SuiDropdownMenuItem } from "../../dropdown";
import { HandledEvent } from "../../../misc/util";
export interface ISelectRenderedOption<T> {
    value: T;
    isActive?: boolean;
    formatter: (o: T) => string;
    usesTemplate: boolean;
    templateSibling: ViewContainerRef;
}
export declare class SuiSelectOption<T> extends SuiDropdownMenuItem implements ISelectRenderedOption<T> {
    private _optionClasses;
    value: T;
    onSelected: EventEmitter<T>;
    isActive: boolean;
    renderedText?: string;
    formatter: (obj: T) => string;
    usesTemplate: boolean;
    templateSibling: ViewContainerRef;
    constructor(renderer: Renderer2, element: ElementRef);
    onClick(e: HandledEvent): void;
}
