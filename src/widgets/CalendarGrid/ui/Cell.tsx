import { Box, BoxProps } from "@chakra-ui/react";

const Cell = (props: BoxProps) => {
  
  return (
    <Box      
      // w="calc(14.5%)"
      h="150px"
      bg={"whiteAlpha.500"}
      borderRadius="md"

      padding={'1'}
      {...props}
    />
  );
};

export default Cell