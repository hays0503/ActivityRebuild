import { MonthLength } from "./Grid";


function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}


function getMonthLength(year: number, month: number): MonthLength {
  return getDaysInMonth(year, month) as MonthLength;
}

export { 
    getDaysInMonth,getMonthLength
}