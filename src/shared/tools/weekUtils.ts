// weekUtils.ts

import { CalendarCursor } from "../hooks/useCalendarNavigator";
import { fromDayOfYear, getDayOfYear } from "./dayUtils";
import {
  getDaysInMonth,
  getWeeksInMonth,
  nextMonth,
  prevMonth,
} from "./monthUtils";

/**
 * Возвращает следующую неделю, основываясь на данных курсора.
 *
 * Если в месяце есть недель с индексом weekIndex + 1, то возвращает ее.
 * Если не существует, то возвращает первую неделю следующего месяца.
 *
 * @param {CalendarCursor} cursor - Текущее состояние навигатора.
 * @returns {CalendarCursor} Следующее состояние навигатора.
 */
export function nextWeek(cursor: any): CalendarCursor {
  const { year, month, weekIndex, dayIndex } = cursor;
  const weeks = getWeeksInMonth(year, month);
  const days = new Date(year, month, dayIndex + 7).getDate();
  if (weekIndex + 1 < weeks) {
    return { year, month, weekIndex: weekIndex + 1, dayIndex: days };
  }

  const next = nextMonth(year, month);
  const nextWeeks = getWeeksInMonth(next.year, next.month);

  return {
    year: next.year,
    month: next.month,
    weekIndex: 0,
    dayIndex: 0,
  };
}

/**
 * Возвращает предыдущую неделю, основываясь на данных курсора.
 *
 * Если в месяце есть недель с индексом weekIndex - 1, то возвращает ее.
 * Если не существует, то возвращает последнюю неделю предыдущего месяца.
 *
 * @param {CalendarCursor} cursor - Текущее состояние навигатора.
 * @returns {CalendarCursor} Предыдущее состояние навигатора.
 */
export function prevWeek(cursor: CalendarCursor): CalendarCursor {
  const { year, month, weekIndex, dayIndex } = cursor;
  
  // День по счёту в году
  const dayOfYear = getDayOfYear(new Date(year, month, dayIndex));
  if(dayOfYear > 7){
    const date = fromDayOfYear(year, dayOfYear - 7);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    }
  }else{
    const date = fromDayOfYear(year-1, dayOfYear - 7);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    } 
  }
}

export function getDaysInWeekUnderCursor(cursor: CalendarCursor): Date[] {
  const days0 = new Date(cursor.year, cursor.month, cursor.dayIndex);
  const daysOffset1 = new Date(cursor.year, cursor.month, cursor.dayIndex + 1);
  const daysOffset2 = new Date(cursor.year, cursor.month, cursor.dayIndex + 2);
  const daysOffset3 = new Date(cursor.year, cursor.month, cursor.dayIndex + 3);
  const daysOffset4 = new Date(cursor.year, cursor.month, cursor.dayIndex + 4);
  const daysOffset5 = new Date(cursor.year, cursor.month, cursor.dayIndex + 5);
  const daysOffset6 = new Date(cursor.year, cursor.month, cursor.dayIndex + 6);
  return [
    days0,
    daysOffset1,
    daysOffset2,
    daysOffset3,
    daysOffset4,
    daysOffset5,
    daysOffset6,
  ];
}
