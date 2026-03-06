import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiPaperclip, FiSend, FiChevronLeft } from "react-icons/fi";
import { MdEmojiEmotions } from "react-icons/md";
import { HiOutlineChevronRight } from "react-icons/hi";
import { IoGlobeOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import type { Message } from "@suleigolden/sulber-api-client";
import { api, type UserProfile } from "@suleigolden/sulber-api-client";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { formatMessageDate } from "~/common/utils/date-time";
import { useRef, useEffect } from "react";

function displayNameFromProfile(
  profile: UserProfile | null | undefined,
  fallbackEmail: string
): string {
  if (!profile) return fallbackEmail?.split("@")[0] || "User";
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return name.trim() || fallbackEmail?.split("@")[0] || "User";
}

type ChatPanelProps = {
  otherUser: { id: string; email: string } | null;
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  isSending: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onBack?: () => void;
};

/** Groups messages by date, oldest first (for display order). */
function groupMessagesByDate(messages: Message[]): Array<{ date: string; messages: Message[] }> {
  const chronological = [...messages].reverse();
  const groups: Array<{ date: string; messages: Message[] }> = [];
  let currentDate = "";
  for (const msg of chronological) {
    const m = msg as { sent_at?: string; created_at?: string };
    const dateStr = formatMessageDate(m.sent_at ?? m.created_at ?? "");
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      groups.push({ date: dateStr, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

export const ChatPanel = ({
  otherUser,
  messages,
  currentUserId,
  isLoading,
  isSending,
  draft,
  onDraftChange,
  onSend,
  onBack,
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ["user-profile", otherUser?.id],
    queryFn: async () => {
      if (!otherUser?.id) return null;
      try {
        return (await api.service("user-profile").get(otherUser.id)) as UserProfile;
      } catch {
        return null;
      }
    },
    enabled: !!otherUser?.id,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!otherUser) {
    return (
      <Box
        flex="1"
        bg={bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="48px"
      >
        <Text color="gray.500" fontSize="16px">
          Select a conversation or start a new message
        </Text>
      </Box>
    );
  }

  const displayName = displayNameFromProfile(profile, otherUser.email ?? "");
  const avatarUrl = profile?.avatar_url ?? undefined;
  // Show both sent and received messages (no filtering — backend returns full thread)
  const groups = groupMessagesByDate(messages);

  return (
    <Box
      flex="1"
      display="flex"
      flexDirection="column"
      minWidth={0}
      bg={bg}
      borderLeftWidth={{ base: 0, md: "1px" }}
      borderColor={borderColor}
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px="24px"
        py="16px"
        borderBottomWidth="1px"
        borderColor={borderColor}
        flexShrink={0}
      >
        <Flex align="center" gap="12px" minWidth={0}>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              p="6px"
              aria-label="Back to conversations"
              onClick={onBack}
              display={{ base: "flex", md: "none" }}
              mr="4px"
            >
              <Icon as={FiChevronLeft} boxSize="22px" />
            </Button>
          )}
          <Avatar
            size="md"
            name={displayName}
            src={avatarUrl}
            bg="brand.400"
            color="white"
          />
          <Box minWidth={0}>
            <Text fontWeight="600" fontSize="16px" noOfLines={1}>
              {displayName}
            </Text>
            <Flex align="center" gap="6px" mt="2px">
              <Icon as={IoGlobeOutline} boxSize="14px" color="gray.500" />
              <Text fontSize="13px" color="gray.500">
                Translation on
              </Text>
            </Flex>
          </Box>
          <Button variant="ghost" size="sm" p="6px" aria-label="View profile">
            <Icon as={HiOutlineChevronRight} boxSize="20px" />
          </Button>
        </Flex>
        <Button
          size="sm"
          variant="outline"
          borderRadius="8px"
          fontWeight="500"
          flexShrink={0}
        >
          Show reservation
        </Button>
      </Flex>

      {/* Messages */}
      <Box
        flex="1"
        overflowY="auto"
        px="24px"
        py="20px"
        display="flex"
        flexDirection="column"
      >
        {isLoading ? (
          <Text color="gray.500">Loading messages...</Text>
        ) : groups.length === 0 ? (
          <Text color="gray.500" fontSize="14px">
            No messages yet. Say hello!
          </Text>
        ) : (
          groups.map((group) => (
            <Box key={group.date}>
              <DateSeparator date={group.date} />
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
                  />
                );
              })}
            </Box>
          ))
        )}
        <Box ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        px="24px"
        py="16px"
        borderTopWidth="1px"
        borderColor={borderColor}
        flexShrink={0}
      >
        <InputGroup size="md" bg={inputBg} borderRadius="12px">
          <Input
            placeholder="Write a message..."
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            border="none"
            _focus={{ boxShadow: "none" }}
            pr="100px"
          />
          <InputRightElement width="auto" gap="4px" pr="8px">
            <Button
              variant="ghost"
              size="sm"
              p="6px"
              aria-label="Attach"
            >
              <Icon as={FiPaperclip} boxSize="18px" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              p="6px"
              aria-label="Emoji"
            >
              <Icon as={MdEmojiEmotions} boxSize="18px" />
            </Button>
            <Button
              size="sm"
              colorScheme="gray"
              bg="gray.800"
              color="white"
              borderRadius="full"
              p="8px"
              aria-label="Send"
              onClick={onSend}
              isLoading={isSending}
              isDisabled={!draft.trim()}
              _hover={{ bg: "gray.700" }}
            >
              <Icon as={FiSend} boxSize="18px" />
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text fontSize="13px" color="gray.500" mt="10px">
          Typical response time: 20 minutes
        </Text>
      </Box>
    </Box>
  );
};
