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
import { CalendarMode } from "../services/calendar.service";
import { CalendarRangeService } from "../services/calendar-range.service";
import { DateParser } from "../classes/date-parser";
var CalendarRangeMinuteService = (function (_super) {
    __extends(CalendarRangeMinuteService, _super);
    function CalendarRangeMinuteService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CalendarRangeMinuteService.prototype.calcStart = function (start) {
        return DateUtil.startOf(DatePrecision.Hour, DateUtil.clone(start), true);
    };
    CalendarRangeMinuteService.prototype.calcDates = function (start) {
        return Util.Array
            .range(this.length)
            .map(function (i) { return DateUtil.add(DatePrecision.Minute, DateUtil.clone(start), i * 5); });
    };
    CalendarRangeMinuteService.prototype.configureItem = function (item, baseDate) {
        var hs = Util.String.padLeft(item.date.getHours().toString(), 2, "0");
        var ms = Util.String.padLeft(item.date.getMinutes().toString(), 2, "0");
        item.humanReadable = hs + ":" + ms;
        item.isOutsideRange = false;
        item.isToday = false;
    };
    return CalendarRangeMinuteService;
}(CalendarRangeService));
export { CalendarRangeMinuteService };
var SuiCalendarMinuteView = (function (_super) {
    __extends(SuiCalendarMinuteView, _super);
    function SuiCalendarMinuteView() {
        return _super.call(this, CalendarViewType.Minute, new CalendarRangeMinuteService(DatePrecision.Hour, 4, 3)) || this;
    }
    Object.defineProperty(SuiCalendarMinuteView.prototype, "date", {
        get: function () {
            var _a = new DateParser("HH:00|MMMM D, YYYY", this.service.localeValues)
                .format(this.currentDate)
                .split("|"), time = _a[0], date = _a[1];
            if (this.service.config.mode !== CalendarMode.TimeOnly) {
                return date + " " + time;
            }
            return time;
        },
        enumerable: true,
        configurable: true
    });
    return SuiCalendarMinuteView;
}(CalendarView));
SuiCalendarMinuteView = __decorate([
    Component({
        selector: "sui-calendar-minute-view",
        template: "\n<table class=\"ui celled center aligned unstackable table three column minute\">\n<thead>\n    <tr>\n        <th colspan=\"4\">\n            <span class=\"link\" (click)=\"zoomOut()\">{{ date }}</span>\n            <span class=\"prev link\" [class.disabled]=\"!ranges.canMovePrevious\" (click)=\"ranges.movePrevious()\">\n                <i class=\"chevron left icon\"></i>\n            </span>\n            <span class=\"next link\" [class.disabled]=\"!ranges.canMoveNext\" (click)=\"ranges.moveNext()\">\n                <i class=\"chevron right icon\"></i>\n            </span>\n        </th>\n    </tr>\n</thead>\n<tbody>\n    <tr *ngFor=\"let group of ranges.current.groupedItems\">\n        <td class=\"link\"\n            *ngFor=\"let item of group\"\n            [calendarItem]=\"item\"\n            (click)=\"setDate(item)\">{{ item.humanReadable }}\n        </td>\n    </tr>\n</tbody>\n</table>\n"
    }),
    __metadata("design:paramtypes", [])
], SuiCalendarMinuteView);
export { SuiCalendarMinuteView };
//# sourceMappingURL=minute-view.js.map