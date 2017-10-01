export declare class Calendar {
    firstWeekDay: number;
    constructor(firstWeekDay?: number);
    weekStartDate(date: any): Date;
    monthDates(year: any, month: any, dayFormatter?: any, weekFormatter?: any): any[];
    monthDays(year: any, month: any): any[];
    monthText(year: any, month: any): string;
}
