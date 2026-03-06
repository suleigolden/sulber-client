import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { FiMessageCircle } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";

type EmptyStateProps = {
  /** Main message (e.g. "No conversations yet") */
  title: string;
  /** Optional secondary text */
  description?: string;
  /** Optional icon - defaults to message icon */
  icon?: React.ReactNode;
};

/**
 * Reusable empty state for messaging UI (no conversations, no search results, etc.).
 */
export function EmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const titleColor = useColorModeValue("gray.700", "gray.300");
  const descColor = useColorModeValue("gray.500", "gray.400");

  return (
    <VStack
      flex="1"
      justify="center"
      align="center"
      py={12}
      px={6}
      spacing={4}
      textAlign="center"
    >
      <Box color={iconColor}>
        {icon ?? <Icon as={FiMessageCircle} boxSize="48px" />}
      </Box>
      <Text fontSize="lg" fontWeight="600" color={titleColor}>
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color={descColor} maxW="280px">
          {description}
        </Text>
      )}
    </VStack>
  );
}
