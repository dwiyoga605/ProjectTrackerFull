import { TemplateRef } from "@angular/core";
import { ITemplateRefContext, PositioningPlacement } from "../../../misc/util";
import { IPopup } from "./popup-controller";
export declare type PopupTrigger = "hover" | "click" | "outsideClick" | "focus" | "manual";
export declare const PopupTrigger: {
    Hover: PopupTrigger;
    Click: PopupTrigger;
    OutsideClick: PopupTrigger;
    Focus: PopupTrigger;
    Manual: PopupTrigger;
};
export interface IPopupConfig {
    header?: string;
    text?: string;
    template?: TemplateRef<ITemplateRefContext<IPopup>>;
    placement?: PositioningPlacement;
    trigger?: PopupTrigger;
    isInverted?: boolean;
    delay?: number;
    isBasic?: boolean;
    transition?: string;
    transitionDuration?: number;
}
export declare class PopupConfig implements IPopupConfig {
    header: string;
    text: string;
    template: TemplateRef<ITemplateRefContext<IPopup>>;
    placement: PositioningPlacement;
    trigger: PopupTrigger;
    isInverted: boolean;
    delay: number;
    isBasic: boolean;
    transition: string;
    transitionDuration: number;
    constructor(defaults?: IPopupConfig);
    batch(config?: IPopupConfig): void;
}
