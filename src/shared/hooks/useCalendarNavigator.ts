import { useState, useCallback, startTransition } from "react";
import { getNextState, getPrevState } from "../tools/navigatorLogic";

export type CalendarView = "month" | "week" | "day";

export interface CalendarCursor {
  year: number;
  month: number; // 0–11
  weekIndex: number;
  dayIndex: number;
}

export interface CalendarNavigator {
  view: CalendarView;
  cursor: CalendarCursor;
  goToMonth: (year: number, month: number) => void;
  goToWeek: (weekIndex: number, year?: number, month?: number) => void;
  goToDay: (dayIndex: number, year?: number, month?: number) => void;
  next: () => void;
  prev: () => void;
  setView: (view: CalendarView) => void;
}

export function useCalendarNavigator(): CalendarNavigator {
  const today = new Date();

  const [view, setView] = useState<CalendarView>("month");
  const [cursor, setCursor] = useState<CalendarCursor>({
    year: today.getFullYear(),
    month: today.getMonth(),
    weekIndex: 0,
    dayIndex: today.getDay(),
  });

  const goToMonth = useCallback(
    (year: number, month: number) => {
      startTransition(() => {
        setView("month");
        setCursor((c) => ({
          ...c,
          year,
          month,
          weekIndex: 0,
          dayIndex: 0,
        }));
      });
    },
    [setCursor, setView]
  );

  const goToWeek = useCallback(
    (weekIndex: number, year?: number, month?: number) => {
      startTransition(() => {
        setView("week");
        setCursor((c) => ({
          ...c,
          year: year ?? c.year,
          month: month ?? c.month,
          weekIndex,
          dayIndex: 0,
        }));
      });
    },
    [setCursor, setView]
  );

  const goToDay = useCallback(
    (dayIndex: number, y?: number, m?: number) => {
      startTransition(() => {
        console.log("goToDay", dayIndex, y, m);
        setView("day");
        setCursor((c) => ({
          ...c,
          year: y ?? c.year,
          month: m ?? c.month,
          dayIndex,
        }));
      });
    },
    [setCursor, setView]
  );

  const next = useCallback(() => {
    startTransition(() => {
      setCursor((c: CalendarCursor) => getNextState(view, c));
    });
  }, [view]);

  const prev = useCallback(() => {
    startTransition(() => {
      setCursor((c: CalendarCursor) => getPrevState(view, c));
    });
  }, [view]);

  return {
    view,
    cursor,
    setView: (view: CalendarView) =>
      startTransition(() => {
        setView(view);
      }),
    next,
    prev,
    goToMonth,
    goToWeek,
    goToDay,
  };
}
