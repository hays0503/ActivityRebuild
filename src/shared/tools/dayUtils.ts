import { CalendarCursor } from "../hooks/useCalendarNavigator";

/**
 * Возвращает следующий день, основываясь на данных курсора.
 *
 * Если dayIndex меньше 6, то возвращает следующий день.
 * Если dayIndex равен 6, то возвращает день с индексом 0 в следующей неделе.
 *
 * Переход в следующую неделю реализуется с помощью функции weekNavigator.
 */
export function nextDay(cursor: any): CalendarCursor {
  const { year, month, weekIndex, dayIndex } = cursor;

  // День по счёту в году
  const dayOfYear = getDayOfYear(new Date(year, month, dayIndex));
  // Количество дней в году получить
  const daysInYear = getDaysInYear(year);

  if (dayOfYear + 1 <= daysInYear) {
    const date = fromDayOfYear(year, dayOfYear + 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    };
  } else {
    const date = fromDayOfYear(year + 1, 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    };
  }
}

/**
 * Возвращает предыдущий день, основываясь на данных курсора.
 *
 * Если dayIndex больше 0, то возвращает предыдущий день.
 * Если dayIndex равен 0, то возвращает день с индексом 6 в текущей неделе.
 */
export function prevDay(cursor: any): CalendarCursor {
  const { year, month, weekIndex, dayIndex } = cursor;

  // День по счёту в году
  const dayOfYear = getDayOfYear(new Date(year, month, dayIndex));

  if (dayOfYear - 1 > 1) {
    const date = fromDayOfYear(year, dayOfYear - 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    };
  } else {
    // Количество дней в году получить
    const daysInYear = getDaysInYear(year-1);
    const date = fromDayOfYear(year - 1, daysInYear);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      weekIndex: 0,
      dayIndex: date.getDate(),
    };
  }
}

export const isWeekend = (
  year: number,
  month: number,
  day: number
): boolean => {
  if (day < 1) return false; // нельзя проверять день = 0
  const date = new Date(year, month, day);
  const dow = date.getDay(); // 0=Вск, 6=Сб
  return dow === 0 || dow === 6;
};

export function fromDayOfYear(year: number, dayOfYear: number): Date {
  const date = new Date(year, 0); // 1 января
  date.setDate(dayOfYear);
  return date;
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0); // 0 января (условный "нулевой" день)
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;

  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

const getDaysInYear = (year = new Date().getFullYear()) =>
  new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
