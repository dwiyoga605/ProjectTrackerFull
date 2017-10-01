var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { SuiPopupController } from "./popup-controller";
var SuiPopupComponentController = (function (_super) {
    __extends(SuiPopupComponentController, _super);
    function SuiPopupComponentController(element, componentFactory, _component, config) {
        var _this = _super.call(this, element, componentFactory, config) || this;
        _this._component = _component;
        _this.popup.onClose.subscribe(function () {
            if (_this._contentComponentRef) {
                _this._contentComponentRef.destroy();
                _this._contentComponentRef = undefined;
            }
        });
        return _this;
    }
    Object.defineProperty(SuiPopupComponentController.prototype, "componentInstance", {
        get: function () {
            if (this._contentComponentRef) {
                return this._contentComponentRef.instance;
            }
        },
        enumerable: true,
        configurable: true
    });
    SuiPopupComponentController.prototype.open = function () {
        this._contentComponentRef = this._componentFactory.createComponent(this._component);
        this._componentFactory.attachToView(this._contentComponentRef, this.popup.templateSibling);
        _super.prototype.open.call(this);
    };
    return SuiPopupComponentController;
}(SuiPopupController));
export { SuiPopupComponentController };
//# sourceMappingURL=popup-component-controller.js.map