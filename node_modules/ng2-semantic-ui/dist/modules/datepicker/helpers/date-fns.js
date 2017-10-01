var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { format, parse } from "date-fns";
import * as defaultLocale from "date-fns/locale/en-US";
function buildLocalizeFn(values, defaultType) {
    return function (dirtyIndex, _a) {
        var type = (_a === void 0 ? { type: defaultType } : _a).type;
        return values[type][dirtyIndex];
    };
}
function buildLocalizeArrayFn(values, defaultType) {
    return function (_a) {
        var type = (_a === void 0 ? { type: defaultType } : _a).type;
        return values[type];
    };
}
function buildMatchFn(patterns, defaultType) {
    return function (dirtyString, _a) {
        var type = (_a === void 0 ? { type: defaultType } : _a).type;
        return dirtyString.match("^(" + patterns[type].join("|") + ")");
    };
}
function buildParseFn(patterns, defaultType) {
    return function (_a, _b) {
        var result = _a[1];
        var type = (_b === void 0 ? { type: defaultType } : _b).type;
        return (patterns[type] || patterns[defaultType])
            .map(function (p) { return new RegExp("^" + p); })
            .findIndex(function (pattern) { return pattern.test(result); });
    };
}
var DateFnsParser = (function () {
    function DateFnsParser(locale) {
        this._weekStartsOn = locale.firstDayOfWeek;
        var weekdayValues = {
            long: locale.weekdays,
            short: locale.weekdaysShort,
            narrow: locale.weekdaysNarrow
        };
        var monthValues = {
            long: locale.months,
            short: locale.monthsShort
        };
        this._locale = defaultLocale;
        this._locale.localize = __assign({}, this._locale.localize, {
            weekday: buildLocalizeFn(weekdayValues, "long"),
            weekdays: buildLocalizeArrayFn(weekdayValues, "long"),
            month: buildLocalizeFn(monthValues, "long"),
            months: buildLocalizeArrayFn(monthValues, "long")
        });
        this._locale.match = __assign({}, this._locale.match, {
            weekdays: buildMatchFn(weekdayValues, "long"),
            weekday: buildParseFn(weekdayValues, "long"),
            months: buildMatchFn(monthValues, "long"),
            month: buildParseFn(monthValues, "long")
        });
    }
    Object.defineProperty(DateFnsParser.prototype, "_config", {
        get: function () {
            return {
                weekStartsOn: this._weekStartsOn,
                locale: this._locale
            };
        },
        enumerable: true,
        configurable: true
    });
    DateFnsParser.prototype.format = function (d, f) {
        return format(d, f, this._config);
    };
    DateFnsParser.prototype.parse = function (dS, f, bD) {
        return parse(dS, f, bD, this._config);
    };
    return DateFnsParser;
}());
export { DateFnsParser };
//# sourceMappingURL=date-fns.js.map