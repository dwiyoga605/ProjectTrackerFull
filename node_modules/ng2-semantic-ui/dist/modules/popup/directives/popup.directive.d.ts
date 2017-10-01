import { ElementRef, TemplateRef } from "@angular/core";
import { ITemplateRefContext, PositioningPlacement, SuiComponentFactory } from "../../../misc/util";
import { SuiPopup } from "../components/popup";
import { PopupConfig, PopupTrigger } from "../classes/popup-config";
import { SuiPopupConfig } from "../services/popup.service";
import { SuiPopupController } from "../classes/popup-controller";
export declare class SuiPopupDirective extends SuiPopupController {
    popupTemplate: TemplateRef<ITemplateRefContext<SuiPopup>>;
    popupHeader: string;
    popupText: string;
    popupInverted: boolean;
    popupBasic: boolean;
    popupTransition: string;
    popupTransitionDuration: number;
    popupPlacement: PositioningPlacement;
    popupDelay: number;
    popupTrigger: PopupTrigger;
    popupConfig: PopupConfig;
    constructor(element: ElementRef, componentFactory: SuiComponentFactory, popupDefaults: SuiPopupConfig);
}
