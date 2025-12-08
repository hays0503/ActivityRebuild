import { CalendarCursor } from "../hooks/useCalendarNavigator";

export function nextMonth(year: number, month: number): CalendarCursor {
  const newMonth = month === 11 ? 0 : month + 1;
  const newYear = month === 11 ? year + 1 : year;
  return { year: newYear, month: newMonth, weekIndex: 0, dayIndex: 0 };
}

export function prevMonth(year: number, month: number) {
  const newMonth = month === 0 ? 11 : month - 1;
  const newYear = month === 0 ? year - 1 : year;
  return { year: newYear, month: newMonth, weekIndex: 0, dayIndex: 0 };
}

export function getWeeksInMonth(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return Math.ceil((first + days) / 7);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
