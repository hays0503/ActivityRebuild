import { TaskType, TaskCountByType, TypeTask } from "@/entities/Task/model/Task";


// Подсчитать все типы задач
const CalcTypeTask = (tasks: TaskType[]): TaskCountByType => {
  // Инициализация объекта со всеми типами равными 0
  const initial: TaskCountByType = Object.values(TypeTask).reduce(
    (acc, type) => {
      acc[type as keyof TaskCountByType] = 0;
      return acc;
    },
    {} as TaskCountByType
  );

  // Подсчет задач
  return tasks.reduce(
    (acc: TaskCountByType, task: TaskType) => {
      acc[task.providerID as unknown as keyof TaskCountByType] += 1;
      return acc;
    },
    { ...initial }
  );
};

export {CalcTypeTask}