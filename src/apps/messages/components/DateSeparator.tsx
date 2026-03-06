import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

type DateSeparatorProps = {
  date: string;
};

export const DateSeparator = ({ date }: DateSeparatorProps) => {
  const lineColor = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex align="center" gap="16px" my="20px" width="100%">
      <Box flex="1" height="1px" bg={lineColor} />
      <Text fontSize="13px" color={textColor} fontWeight="500">
        {date}
      </Text>
      <Box flex="1" height="1px" bg={lineColor} />
    </Flex>
  );
};
