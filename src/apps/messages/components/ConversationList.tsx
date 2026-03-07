import {
  Box,
  Flex,
  Text,
  VStack,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import type { ConversationListItem as ConversationListItemType } from "../types";
import { ConversationSearch } from "./ConversationSearch";
import { ConversationFilters } from "./ConversationFilters";
import type { ConversationFilter } from "./ConversationFilters";
import { ConversationListItem } from "./ConversationListItem";
import { EmptyState } from "./EmptyState";

type ConversationListProps = {
  conversations: ConversationListItemType[];
  selectedUserId: string | null;
  currentUserRole?: string;
  currentUserId: string;
  filter: ConversationFilter;
  onFilterChange: (f: ConversationFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (userId: string) => void;
  totalUnread?: number;
  isLoading?: boolean;
};

/**
 * Left sidebar: header with total unread, search, filters, and list of conversations.
 */
export function ConversationList({
  conversations,
  selectedUserId,
  currentUserRole,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onSelect,
  totalUnread = 0,
  isLoading = false,
}: ConversationListProps) {

  const roleLabel =
    currentUserRole === "customer"
      ? "Provider"
      : currentUserRole === "provider"
        ? "Customer"
        : null;
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      w={{ base: "100%", md: "380px" }}
      minW={{ md: "320px" }}
      h="100%"
      flexShrink={0}
      bg={bg}
      borderRightWidth="1px"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Header: title + total unread */}
      <Box
        px={5}
        pt={5}
        pb={4}
        borderBottomWidth="1px"
        borderColor={headerBorder}
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="700" letterSpacing="-0.02em">
            Messages
          </Text>
          {totalUnread > 0 && (
            <Flex
              bg="red.500"
              color="white"
              fontSize="xs"
              fontWeight="600"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </Flex>
          )}
        </Flex>
        <ConversationSearch
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name or message..."
        />
        <Box mt={3}>
          <ConversationFilters
            filter={filter}
            onFilterChange={onFilterChange}
            totalUnread={totalUnread}
          />
        </Box>
      </Box>

      {/* Conversation list */}
      <VStack
        flex={1}
        overflowY="auto"
        align="stretch"
        spacing={0}
        py={0}
      >
        {isLoading ? (
          <VStack align="stretch" spacing={0} py={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Flex key={i} gap={3} px={4} py={3} align="center">
                <SkeletonCircle size="10" />
                <Box flex={1}>
                  <Skeleton height="4" width="60%" mb={2} borderRadius="md" />
                  <Skeleton height="3" width="90%" borderRadius="md" />
                </Box>
              </Flex>
            ))}
          </VStack>
        ) : conversations.length === 0 ? (
          <EmptyState
            title={
              searchQuery
                ? "No matching conversations"
                : "No conversations yet"
            }
            description={
              searchQuery
                ? "Try a different search."
                : "Start a message from a booking or request."
            }
          />
        ) : (
          conversations.map((conv) => (
            <ConversationListItem
              key={conv.conversation_id}
              conversation={conv}
              roleLabel={roleLabel}
              isSelected={selectedUserId === conv.other_user_id}
              onSelect={() => onSelect(conv.other_user_id)}
            />
          ))
        )}
      </VStack>
    </Box>
  );
}
