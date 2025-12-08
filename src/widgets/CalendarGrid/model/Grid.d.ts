import type { TaskType } from "@/entities/Task/model/Task";

export type MonthLength = 28 | 29 | 30 | 31;

export type DaysInWeek = 7;
export type HoursInDay = 24;

export type FixedArray<T, L extends number> = T[] & { length: L };

// В одном часе может быть любое число задач
export type GridHour = {
  tasks: TaskType[];
};

// День состоит из 24 часов
export type GridDays = {
  tasks: FixedArray<GridHour, HoursInDay>;
};

// Неделя состоит из 7 дней
export type GridWeeks = {
  tasks: FixedArray<GridDays, DaysInWeek>;
};

// Месяц состоит из 28-31 дня
export type GridMonths = {
  tasks: FixedArray<GridDays, MonthLength>;
};
