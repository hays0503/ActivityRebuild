import { For,Box, VStack } from "@chakra-ui/react";
import { GridHour } from "../model/Grid";
import TaskItem from "@/entities/Task/ui/Task";

interface CellsHourProps {
  hour: GridHour;
}

const CellsHour = ({ hour }: CellsHourProps) => {
  return (
    <Box>
      <VStack>
        <For each={hour.tasks}>
          {(item) => <TaskItem key={item.id} task={item} />}
        </For>
      </VStack>
    </Box>
  );
};
export default CellsHour;
