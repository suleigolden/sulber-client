import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import type { ConversationListItem as ConversationListItemType } from "../types";
import { UnreadBadge } from "./UnreadBadge";
import moment from "moment";
import { useSystemColor } from "~/hooks/use-system-color";

const PREVIEW_LENGTH = 48;

type ConversationListItemProps = {
  conversation: ConversationListItemType;
  /** "Provider" when viewer is customer; "Customer" when viewer is provider */
  roleLabel: string | null;
  isSelected: boolean;
  onSelect: () => void;
};

/**
 * Single row in the conversation list: avatar, name, role, last message preview, time, unread badge.
 */
export function ConversationListItem({
  conversation,
  roleLabel,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const { selectedCardBg, menuItemHover, headingColor, mutedTextColor, borderColor } = useSystemColor();

  const lastMessage = conversation.last_message ?? "";
  const preview =
    lastMessage.length > PREVIEW_LENGTH
      ? lastMessage.slice(0, PREVIEW_LENGTH).trim() + "..."
      : lastMessage;

  const timeLabel = conversation.last_message_time
    ? moment(conversation.last_message_time).format("MMM D")
    : "—";

  return (
    <Box
      px={4}
      py={3}
      cursor="pointer"
      bg={isSelected ? selectedCardBg : "transparent"}
      _hover={{ bg: isSelected ? selectedCardBg : menuItemHover }}
      onClick={onSelect}
      transition="background 0.15s"
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <Flex gap={3} align="flex-start">
        <Box position="relative" flexShrink={0}>
          <Avatar
            size="md"
            name={conversation.other_user_name || "User"}
            src={conversation.avatar_url ?? undefined}
            bg="brand.400"
            color="white"
          />
          <Box position="absolute" top="-2px" right="-2px">
            <UnreadBadge count={conversation.unread_count} />
          </Box>
        </Box>
        <Box flex={1} minW={0}>
          <Flex justify="space-between" align="center" gap={2} mb={1}>
            <Flex align="center" gap={2} minW={0}>
              <Text
                fontWeight="600"
                fontSize="15px"
                color={headingColor}
                noOfLines={1}
              >
                {conversation.other_user_name?.trim() || "User"}
              </Text>
              {roleLabel && (
                <Text
                  fontSize="10px"
                  color={mutedTextColor}
                  flexShrink={0}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                  fontWeight="500"
                >
                  {roleLabel}
                </Text>
              )}
            </Flex>
            <Text fontSize="xs" color={mutedTextColor} flexShrink={0}>
              {timeLabel}
            </Text>
          </Flex>
          <Text
            fontSize="sm"
            color={mutedTextColor}
            noOfLines={2}
            lineHeight="1.4"
          >
            {preview || "No messages yet"}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
