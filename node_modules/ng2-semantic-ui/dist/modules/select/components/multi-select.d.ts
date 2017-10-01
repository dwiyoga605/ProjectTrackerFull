import { ElementRef, EventEmitter } from "@angular/core";
import { ICustomValueAccessorHost, CustomValueAccessor } from "../../../misc/util";
import { SuiLocalizationService } from "../../../behaviors/localization";
import { SuiSelectBase } from "../classes/select-base";
export declare class SuiMultiSelect<T, U> extends SuiSelectBase<T, U> implements ICustomValueAccessorHost<U[]> {
    selectedOptions: T[];
    private _writtenOptions?;
    selectedOptionsChange: EventEmitter<U[]>;
    readonly filteredOptions: T[];
    readonly availableOptions: T[];
    private _placeholder;
    placeholder: string;
    maxSelected: number;
    readonly maxSelectedReached: boolean;
    readonly maxSelectedMessage: string;
    private _multiSelectClasses;
    constructor(element: ElementRef, localizationService: SuiLocalizationService);
    protected optionsUpdateHook(): void;
    selectOption(option: T): void;
    writeValue(values: U[]): void;
    deselectOption(option: T): void;
    onQueryInputKeydown(event: KeyboardEvent): void;
}
export declare class SuiMultiSelectValueAccessor<T, U> extends CustomValueAccessor<U[], SuiMultiSelect<T, U>> {
    constructor(host: SuiMultiSelect<T, U>);
}
