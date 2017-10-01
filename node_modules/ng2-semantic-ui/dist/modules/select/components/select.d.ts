import { EventEmitter, ElementRef } from "@angular/core";
import { ICustomValueAccessorHost, CustomValueAccessor } from "../../../misc/util";
import { SuiLocalizationService } from "../../../behaviors/localization";
import { SuiSelectBase } from "../classes/select-base";
import { ISelectRenderedOption } from "./select-option";
export declare class SuiSelect<T, U> extends SuiSelectBase<T, U> implements ICustomValueAccessorHost<U> {
    selectedOption?: T;
    private _writtenOption?;
    private _optionTemplateSibling;
    selectedOptionChange: EventEmitter<U>;
    private _placeholder;
    placeholder: string;
    constructor(element: ElementRef, localizationService: SuiLocalizationService);
    protected optionsUpdateHook(): void;
    protected queryUpdateHook(): void;
    selectOption(option: T): void;
    writeValue(value: U): void;
    protected initialiseRenderedOption(option: ISelectRenderedOption<T>): void;
    private drawSelectedOption();
}
export declare class SuiSelectValueAccessor<T, U> extends CustomValueAccessor<U, SuiSelect<T, U>> {
    constructor(host: SuiSelect<T, U>);
}
