import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiSettings } from "react-icons/fi";
import moment from "moment-timezone";
import type { ConversationListItem } from "../types";
import { ConversationListItem as ConversationListItemComponent } from "./ConversationListItem";

type ConversationListProps = {
  conversations: ConversationListItem[];
  selectedUserId: string | null;
  currentUserId: string;
  onSelect: (userId: string) => void;
  filter: "all" | "unread";
  onFilterChange: (f: "all" | "unread") => void;
};

export const ConversationList = ({
  conversations,
  selectedUserId,
  onSelect,
  filter,
  onFilterChange,
}: ConversationListProps) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBorder = useColorModeValue("gray.200", "gray.600");
  const activeFilterBg = useColorModeValue("gray.800", "white");
  const activeFilterColor = useColorModeValue("white", "gray.800");
  const inactiveFilterBg = useColorModeValue("gray.100", "gray.700");
  const inactiveFilterColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      minWidth={{ md: "360px" }}
      height="100%"
      flexShrink={0}
      bg={bg}
      borderRightWidth="1px"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Header */}
      <Box px="24px" pt="24px" pb="16px" borderBottomWidth="1px" borderColor={headerBorder}>
        <Flex align="center" justify="space-between" mb="20px">
          <Text fontSize="24px" fontWeight="700" letterSpacing="-0.02em">
            Messages
          </Text>
          <Flex gap="8px">
            <Button variant="ghost" size="sm" aria-label="Search" p="8px">
              <Icon as={FiSearch} boxSize="20px" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Settings" p="8px">
              <Icon as={FiSettings} boxSize="20px" />
            </Button>
          </Flex>
        </Flex>

        <InputGroup size="sm" mb="16px" display={{ base: "flex", md: "none" }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search conversations" borderRadius="8px" />
        </InputGroup>

        <Flex gap="8px">
          <Button
            size="sm"
            borderRadius="8px"
            bg={filter === "all" ? activeFilterBg : inactiveFilterBg}
            color={filter === "all" ? activeFilterColor : inactiveFilterColor}
            fontWeight="500"
            onClick={() => onFilterChange("all")}
            _hover={{ opacity: 0.9 }}
          >
            All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            borderRadius="8px"
            bg={filter === "unread" ? activeFilterBg : inactiveFilterBg}
            color={filter === "unread" ? activeFilterColor : inactiveFilterColor}
            fontWeight="500"
            onClick={() => onFilterChange("unread")}
            _hover={{ opacity: 0.9 }}
          >
            Unread
          </Button>
        </Flex>
      </Box>

      {/* Conversation list */}
      <VStack
        flex="1"
        overflowY="auto"
        align="stretch"
        spacing={0}
        py="8px"
      >
        {conversations.length === 0 ? (
          <Box px="24px" py="32px" textAlign="center">
            <Text color="gray.500" fontSize="14px">
              No conversations yet. Start a message from a job or request.
            </Text>
          </Box>
        ) : (
          conversations.map((conv) => (
            <ConversationListItemComponent
              key={conv.conversation_id}
              conversation={conv}
              isSelected={selectedUserId === conv.other_user_id}
              onSelect={() => onSelect(conv.other_user_id)}
              formatDate={(d) => (d ? moment(d).format("DD-MM-YY") : "—")}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};
