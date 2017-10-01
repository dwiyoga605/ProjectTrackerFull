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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { Util, DateUtil, DatePrecision } from "../../../misc/util";
import { CalendarView, CalendarViewType } from "./calendar-view";
import { CalendarRangeService } from "../services/calendar-range.service";
var CalendarRangeYearService = (function (_super) {
    __extends(CalendarRangeYearService, _super);
    function CalendarRangeYearService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CalendarRangeYearService.prototype.configureItem = function (item, baseDate) {
        item.humanReadable = Util.String.padLeft(item.date.getFullYear().toString(), 4, "0");
        item.isOutsideRange = item.date.getFullYear() >= this.calcStart(baseDate).getFullYear() + 10;
    };
    return CalendarRangeYearService;
}(CalendarRangeService));
export { CalendarRangeYearService };
var SuiCalendarYearView = (function (_super) {
    __extends(SuiCalendarYearView, _super);
    function SuiCalendarYearView() {
        return _super.call(this, CalendarViewType.Year, new CalendarRangeYearService(DatePrecision.Decade, 4, 3)) || this;
    }
    Object.defineProperty(SuiCalendarYearView.prototype, "decadeStart", {
        get: function () {
            return DateUtil
                .startOf(DatePrecision.Decade, DateUtil.clone(this.service.currentDate))
                .getFullYear();
        },
        enumerable: true,
        configurable: true
    });
    SuiCalendarYearView.prototype.pad = function (year) {
        return Util.String.padLeft(year.toString(), 4, "0");
    };
    return SuiCalendarYearView;
}(CalendarView));
SuiCalendarYearView = __decorate([
    Component({
        selector: "sui-calendar-year-view",
        template: "\n<table class=\"ui celled center aligned unstackable table three column year\">\n<thead>\n    <tr>\n        <th colspan=\"3\">\n            <span class=\"link\" (click)=\"zoomOut()\">{{ pad(decadeStart) }} - {{ pad(decadeStart + 10) }}</span>\n            <span class=\"prev link\" [class.disabled]=\"!ranges.canMovePrevious\" (click)=\"ranges.movePrevious()\">\n                <i class=\"chevron left icon\"></i>\n            </span>\n            <span class=\"next link\" [class.disabled]=\"!ranges.canMoveNext\" (click)=\"ranges.moveNext()\">\n                <i class=\"chevron right icon\"></i>\n            </span>\n        </th>\n    </tr>\n</thead>\n<tbody>\n    <tr *ngFor=\"let group of ranges.current.groupedItems\">\n        <td class=\"link\"\n            *ngFor=\"let item of group\"\n            [calendarItem]=\"item\"\n            (click)=\"setDate(item)\">{{ item.humanReadable }}\n        </td>\n    </tr>\n</tbody>\n</table>\n"
    }),
    __metadata("design:paramtypes", [])
], SuiCalendarYearView);
export { SuiCalendarYearView };
//# sourceMappingURL=year-view.js.map