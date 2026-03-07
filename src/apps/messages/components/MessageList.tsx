import { useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { Message } from "@suleigolden/sulber-api-client";
import { MessageBubble } from "./MessageBubble";
import { formatMessageDateRelative } from "~/common/utils/date-time";
import { useSystemColor } from "~/hooks/use-system-color";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  /** Display name for the other user (for received message labels) */
  otherUserDisplayName?: string;
  isLoading?: boolean;
  /** Ref for scroll-into-view at bottom */
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
};

/** Groups messages by date (Today, Yesterday, or full date), chronological order for display. */
function groupMessagesByDate(
  messages: Message[]
): Array<{ dateLabel: string; messages: Message[] }> {
  const chronological = [...messages].reverse();
  const groups: Array<{ dateLabel: string; messages: Message[] }> = [];
  let currentDateLabel = "";
  for (const msg of chronological) {
    const sentAt =
      (msg as { sent_at?: string }).sent_at ??
      (msg as { created_at?: string }).created_at ??
      "";
    const dateLabel = formatMessageDateRelative(sentAt);
    if (dateLabel !== currentDateLabel) {
      currentDateLabel = dateLabel;
      groups.push({ dateLabel, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

/**
 * Scrollable message list with date separators (Today, Yesterday, March 4, 2026) and bubbles.
 */
export function MessageList({
  messages,
  currentUserId,
  otherUserDisplayName = "User",
  isLoading = false,
  messagesEndRef,
}: MessageListProps) {
  const { dividerColor, mutedTextColor } = useSystemColor();

  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, messagesEndRef]);

  if (isLoading) {
    return (
      <Flex flex={1} align="center" justify="center" p={8}>
        <Text color={mutedTextColor} fontSize="sm">
          Loading messages...
        </Text>
      </Flex>
    );
  }

  const groups = groupMessagesByDate(messages);
 
  return (
    <Box
      flex={1}
      overflowY="auto"
      px={{ base: 4, md: 6 }}
      py={4}
      display="flex"
      flexDirection="column"
    >
      {groups.length === 0 ? (
        <Flex flex={1} align="center" justify="center">
          <Text color={mutedTextColor} fontSize="sm">
            No messages yet. Say hello!
          </Text>
        </Flex>
      ) : (
        groups.map((group) => (
          <Box key={group.dateLabel}>
            <Flex align="center" gap={4} my={4} w="100%">
              <Box flex={1} h="1px" bg={dividerColor} />
              <Text fontSize="xs" color={mutedTextColor} fontWeight="500">
                {group.dateLabel}
              </Text>
              <Box flex={1} h="1px" bg={dividerColor} />
            </Flex>
            {group.messages.map((msg, idx) => {
              const isMine = msg.sender_id === currentUserId;
              const showAvatarAndName =
                !isMine &&
                (idx === 0 ||
                  group.messages[idx - 1].sender_id !== msg.sender_id);
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMine={isMine}
                  showAvatarAndName={showAvatarAndName}
                  senderDisplayName={otherUserDisplayName}
                />
              );
            })}
          </Box>
        ))
      )}
      <Box ref={messagesEndRef} />
    </Box>
  );
}
