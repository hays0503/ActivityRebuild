import { Box } from "@chakra-ui/react";
import { TaskType, TypeTask, TaskCountByType } from "@/entities/Task/model/Task";
import { CalcTypeTask } from "../model/calcTask";
import React from "react";

// Настройка иконок для каждого типа задач
// const TaskTypeIcons: Record<TypeTask, React.ReactNode | null> = {
//   [TypeTask.Встреча]: "!",
//   [TypeTask["Звонок (входящий)"]]: "!",
//   [TypeTask["Звонок (исходящий)"]]: "!",
//   [TypeTask.Задача]: null,
//   [TypeTask["Письмо (полученное)"]]: "!",
//   [TypeTask["Письмо (отправленное)"]]: "!",
//   [TypeTask.Дело]: null,
//   [TypeTask["Обратный звонок"]]: "!",
//   [TypeTask.Обзвон]: "!",
//   [TypeTask["СМС-сообщение"]]: null,
//   [TypeTask["Сообщение (ЕЦУ)"]]: null,
//   [TypeTask["Входящий чат"]]: null,
//   [TypeTask["Исходящий чат"]]: null,
//   [TypeTask["CRM-форма"]]: null,
//   [TypeTask."Задание"]: null,
//   [TypeTask["Дело приложения (старая версия)"]]: null,
//   [TypeTask["Дело приложения"]]: null,
//   [TypeTask["Сообщение в WhatsApp"]]: null,
//   [TypeTask.Визит]: null,
// };

const DrawTasks = ({ TaskItems }: { TaskItems: TaskType[] }) => {
  const typeTasks: TaskCountByType = CalcTypeTask(TaskItems);

  console.log("typeTasks", typeTasks);

  return (
    <Box display="flex" gap={2}>
      {Object.values(TypeTask).map((type) => {
        const count = typeTasks[type as keyof TaskCountByType];
        if (count > 0) {
          // const icon = TaskTypeIcons[type as keyof TaskCountByType];
          return (
            <Box key={type} title={`${type}: ${count}`}>
              {`${type}: ${count}`}
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
};

export default DrawTasks;
