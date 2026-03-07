/**
 * Messaging page: 2-column layout (conversation list + chat panel).
 * Customers chat with providers; providers chat with customers.
 * Uses real API: conversations, messages, mark read, send.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { api, type User } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { useSystemColor } from "~/hooks/use-system-color";
import type { ConversationListItem } from "./types";
import { ConversationList } from "./components/ConversationList";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { EmptyState } from "./components/EmptyState";
import type { ConversationFilter } from "./components/ConversationFilters";
import { useQuery as useProfileQuery } from "@tanstack/react-query";
import type { Message, UserProfile } from "@suleigolden/sulber-api-client";

/** Normalize conversation list from API (snake_case and numbers). */
function normalizeConversations(
  data: unknown
): ConversationListItem[] {
  const list = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
  return (list as ConversationListItem[]).map((c) => ({
    conversation_id: c.conversation_id,
    other_user_id: c.other_user_id,
    other_user_name: c.other_user_name ?? "User",
    avatar_url: c.avatar_url ?? null,
    unread_count: Number(c.unread_count ?? 0),
    last_message: c.last_message ?? null,
    last_message_time: c.last_message_time ?? null,
    last_message_sender_id: c.last_message_sender_id ?? null,
  }));
}

export const MessagesUIView = () => {
  const { user } = useUser();
  const { modalBg, borderColor } = useSystemColor();
  const toast = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");

  // Fetch conversations (message service delegates to conversations)
  const { data: rawConversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["messages", "conversations", user?.id],
    queryFn: async () => {
      if (!user?.id || !user?.role) return [];
      const messageService = api.service("message") as { getConversations: (data: { user: { id: string; role: string } }) => Promise<unknown> };
      const data = await messageService.getConversations({ user: { id: user.id, role: user.role } });
      return normalizeConversations(data);
    },
    enabled: !!user?.id && !!user?.role,
    refetchInterval: 8000,
  });

  // Total unread for header badge (conversation service may not be in published client types)
  const { data: totalUnreadData } = useQuery({
    queryKey: ["conversations", "total-unread", user?.id],
    queryFn: async () => {
      try {
        const convApi = api as { service: (n: string) => { getTotalUnread?: () => Promise<{ total_unread: number }> } };
        const svc = convApi.service("conversation");
        return svc.getTotalUnread ? await svc.getTotalUnread() : { total_unread: 0 };
      } catch {
        return { total_unread: 0 };
      }
    },
    enabled: !!user?.id,
    refetchInterval: 8000,
  });
  const totalUnread = totalUnreadData?.total_unread ?? 0;

  // Filter and search conversations
  const conversations = useMemo(() => {
    let list = rawConversations;
    if (filter === "unread") {
      list = list.filter((c) => c.unread_count > 0);
    } else if (filter === "sent" && user?.id) {
      list = list.filter(
        (c) => (c as ConversationListItem & { last_message_sender_id?: string }).last_message_sender_id === user.id
      );
    } else if (filter === "received" && user?.id) {
      list = list.filter(
        (c) => (c as ConversationListItem & { last_message_sender_id?: string }).last_message_sender_id !== user.id
      );
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          (c.other_user_name ?? "").toLowerCase().includes(q) ||
          (c.last_message ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [rawConversations, filter, searchQuery, user?.id]);

  // Auto-select first conversation on desktop when list loads
  useEffect(() => {
    if (conversations.length > 0 && !selectedUserId) {
      setSelectedUserId(conversations[0].other_user_id);
    }
  }, [conversations.length, selectedUserId]);

  // Messages for selected conversation (frontend sends current user and other userId)
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", "with", selectedUserId, user?.id],
    queryFn: () =>
      (api.service("message") as unknown as {
        getWithUser: (data: { user: { id: string; role: string }; userId: string }, opts?: { limit?: number }) => Promise<unknown[]>;
      }).getWithUser(
        { user: { id: user!.id, role: user!.role }, userId: selectedUserId! },
        { limit: 100 }
      ),
    enabled: !!user?.id && !!user?.role && !!selectedUserId,
    refetchInterval: 5000,
  });
  // Mark conversation as read when user opens it
  const selectedConv = selectedUserId
    ? conversations.find((c) => c.other_user_id === selectedUserId)
    : null;
  useEffect(() => {
    if (!selectedConv?.conversation_id || selectedConv.unread_count <= 0) return;
    const convApi = api as { service: (n: string) => { markAsRead?: (id: string) => Promise<void> } };
    const svc = convApi.service("conversation");
    if (svc.markAsRead) {
      svc
        .markAsRead(selectedConv.conversation_id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
          queryClient.invalidateQueries({ queryKey: ["conversations", "total-unread"] });
        })
        .catch(() => {});
    }
  }, [selectedConv?.conversation_id, selectedConv?.unread_count, queryClient]);

  // Send message: pass current user as sender (API client sends it in the request body).
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      api.service("message").createMessage({
        recipientId: selectedUserId!,
        content,
        sender: user as User,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "total-unread"] });
      setDraft("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to send",
        description: err.message || "Could not send message",
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !selectedUserId || sendMutation.isPending || selectedUserId === user?.id) return;
    sendMutation.mutate(text);
  };

  const handleSelectUser = (userId: string) => {
    if (!userId || userId === user?.id) return;
    setSelectedUserId(userId);
  };

  const roleLabel =
    user?.role === "customer"
      ? "Provider"
      : user?.role === "provider"
        ? "Customer"
        : "User";

  const showList = useBreakpointValue({
    base: !selectedUserId,
    md: true,
  });
  const showChat = useBreakpointValue({
    base: !!selectedUserId,
    md: true,
  });

  return (
    <Box
      w="100%"
      h="calc(100vh - 140px)"
      minH="500px"
      maxW="1400px"
      mx="auto"
      px={{ base: 0, md: 4 }}
      py={{ base: 2, md: 4 }}
    >
      <Flex
        h="100%"
        bg={modalBg}
        borderRadius={{ md: "xl" }}
        boxShadow={{ md: "sm" }}
        overflow="hidden"
        borderWidth={{ md: "1px" }}
        borderColor={borderColor}
      >
        {showList && (
          <Box flexShrink={0} h="100%" overflow="hidden">
            <ConversationList
              conversations={conversations}
              selectedUserId={selectedUserId}
              currentUserId={user?.id ?? ""}
              currentUserRole={user?.role}
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelect={handleSelectUser}
              totalUnread={totalUnread}
              isLoading={conversationsLoading}
            />
          </Box>
        )}

        {showChat && (
          <ChatPanel
            selectedUserId={selectedUserId}
            selectedConv={selectedConv}
            messages={messages}
            currentUserId={user?.id ?? ""}
            roleLabel={roleLabel}
            messagesLoading={messagesLoading}
            draft={draft}
            onDraftChange={setDraft}
            onSend={handleSend}
            isSending={sendMutation.isPending}
            onBack={() => setSelectedUserId(null)}
            messagesEndRef={messagesEndRef}
          />
        )}
      </Flex>
    </Box>
  );
};

/** Right-hand chat panel: header, message list, input. */
function ChatPanel({
  selectedUserId,
  selectedConv,
  messages,
  currentUserId,
  roleLabel,
  messagesLoading,
  draft,
  onDraftChange,
  onSend,
  isSending,
  onBack,
  messagesEndRef,
}: {
  selectedUserId: string | null;
  selectedConv: ConversationListItem | null | undefined;
  messages: unknown[];
  currentUserId: string;
  roleLabel: string;
  messagesLoading: boolean;
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  isSending: boolean;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { data: profile } = useProfileQuery<UserProfile | null>({
    queryKey: ["user-profile", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      try {
        return (await api.service("user-profile").get(selectedUserId)) as UserProfile;
      } catch {
        return null;
      }
    },
    enabled: !!selectedUserId,
  });

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || "User"
    : selectedConv?.other_user_name ?? "User";
  const avatarUrl = profile?.avatar_url ?? selectedConv?.avatar_url ?? null;

  const { modalBg, borderColor } = useSystemColor();

  if (!selectedUserId) {
    return (
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={modalBg}
      >
        <EmptyState
          title="Select a conversation"
          description="Choose a conversation from the list or start a new message."
        />
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      minW={0}
      bg={modalBg}
      borderLeftWidth={{ base: 0, md: "1px" }}
      borderColor={borderColor}
    >
      <ChatHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        roleLabel={roleLabel}
        onBack={onBack}
      />
      <MessageList
        messages={messages as Message[]}
        currentUserId={currentUserId}
        otherUserDisplayName={displayName}
        isLoading={messagesLoading}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        isSending={isSending}
      />
    </Box>
  );
}

/** Export as Messages for the layout route. */
export const Messages = MessagesUIView;
