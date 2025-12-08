import { Text } from "@chakra-ui/react";
import { TaskType } from "../model/Task";

interface TaskItemProps {
  task: TaskType;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { id, name, description } = task;

  return <Text>{`${id} - ${name} - ${description}`}</Text>;
};

export default TaskItem;
