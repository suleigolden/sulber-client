import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";

type ChatHeaderProps = {
  /** Other participant's display name */
  displayName: string;
  /** Other participant's avatar URL */
  avatarUrl?: string | null;
  /** Role badge: "Customer" or "Provider" */
  roleLabel: string;
  /** Online status placeholder - not implemented yet */
  isOnline?: boolean;
  onBack?: () => void;
};

/**
 * Sticky header for the chat panel: back (mobile), avatar, name, role, status.
 */
export function ChatHeader({
  displayName,
  avatarUrl,
  roleLabel,
  onBack,
}: ChatHeaderProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const subColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      align="center"
      gap={3}
      px={{ base: 4, md: 6 }}
      py={4}
      borderBottomWidth="1px"
      borderColor={borderColor}
      flexShrink={0}
      bg="inherit"
    >
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          p={2}
          aria-label="Back to conversations"
          onClick={onBack}
          display={{ base: "flex", md: "none" }}
        >
          <Icon as={FiChevronLeft} boxSize={6} />
        </Button>
      )}
      <Avatar
        size="md"
        name={displayName}
        src={avatarUrl ?? undefined}
        bg="brand.400"
        color="white"
      />
      <Box flex={1} minW={0}>
        <Text fontWeight="600" fontSize="md" noOfLines={1}>
          {displayName}
        </Text>
        <Flex align="center" gap={2} mt={0.5}>
          <Text fontSize="xs" color={subColor}>
            {roleLabel}
          </Text>
          <Box
            w="6px"
            h="6px"
            borderRadius="full"
            bg={subColor}
            title="Status"
          />
          <Text fontSize="xs" color={subColor}>
            Offline
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
