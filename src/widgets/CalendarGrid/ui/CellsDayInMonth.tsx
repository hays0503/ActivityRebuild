// Компонент который отвечает за отображение ячеек дня

import { TaskType } from "@/entities/Task/model/Task";
import { VStack } from "@chakra-ui/react";
// import DayText from "./DayText";
import Cell from "./Cell";
import DrawTasks from "./DrawTasks";

interface CellsDayProps {
  tasks: TaskType[];
}


const CellsDayInMonth = ({ tasks }: CellsDayProps) => {
  const CountTask = tasks.length;

  if (CountTask === 0) {
    return <Cell />;
  }

  // const Day = tasks[0].end.getDay();
  
  return (
    <Cell>
      <VStack>
        {/* <DayText Day={Day.toString()} /> */}
        <DrawTasks TaskItems={tasks} />
      </VStack>
    </Cell>
  );
};

export default CellsDayInMonth;
