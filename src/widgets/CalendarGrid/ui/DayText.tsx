import { Box, Text } from "@chakra-ui/react";

// Компонент который отвечает за отображение текста дня
const DayText = ({ Day }: { Day: string }) => (
  <Box>
    <Text>{Day}</Text>
  </Box>
);

export default DayText