// navigatorLogic.ts

import { CalendarCursor, CalendarView } from "../hooks/useCalendarNavigator";
import { nextDay, prevDay } from "./dayUtils";
import { nextMonth, prevMonth } from "./monthUtils";
import { nextWeek, prevWeek } from "./weekUtils";

export function getNextState(
  view: CalendarView,
  cursor: CalendarCursor
): CalendarCursor {
  if (view === "month") {
    return nextMonth(cursor.year, cursor.month);
  }

  if (view === "week") {
    return nextWeek(cursor);
  }

  if (view === "day") {
    return nextDay(cursor);
  }

  return cursor;
}

export function getPrevState(view: CalendarView, cursor: CalendarCursor) {
  if (view === "month") {
    return prevMonth(cursor.year, cursor.month);
  }

  if (view === "week") {
    return prevWeek(cursor);
  }

  if (view === "day") {
    const d = prevDay(cursor);
    if (cursor.dayIndex > 0) {
      return { ...cursor, ...d };
    }
    const week = prevWeek(cursor);
    return { ...week, dayIndex: 6 };
  }

  return cursor;
}
