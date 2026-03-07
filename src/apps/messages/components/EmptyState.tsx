import { Box, Text, VStack } from "@chakra-ui/react";
import { FiMessageCircle } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { useSystemColor } from "~/hooks/use-system-color";

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
  const { iconMutedColor, headingColor, bodyColor } = useSystemColor();

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
      <Box color={iconMutedColor}>
        {icon ?? <Icon as={FiMessageCircle} boxSize="48px" />}
      </Box>
      <Text fontSize="lg" fontWeight="600" color={headingColor}>
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color={bodyColor} maxW="280px">
          {description}
        </Text>
      )}
    </VStack>
  );
}
