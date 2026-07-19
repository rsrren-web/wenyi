declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
  export class Lunar {
    static fromDate(date: Date): Lunar;
    getYearInGanZhi(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
  }
}
