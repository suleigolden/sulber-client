import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Flex, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { ConversationList } from "./components/ConversationList";
import { ChatPanel } from "./components/ChatPanel";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import type { ConversationListItem } from "../messages/types";

/**
 * Messages view: Customer sees conversations with providers; Provider sees conversations with customers.
 * - Customer: provider names on left, messages with provider on click
 * - Provider: customer names on left, messages with customer on click
 */
export const MessagesView = () => {
  const { user } = useUser();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const withUserId = searchParams.get("with");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(withUserId || null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Initialize from ?with=<otherUserId>, but never allow selecting myself
  useEffect(() => {
    if (!withUserId) return;
    if (withUserId === user?.id) return;
    if (withUserId !== selectedUserId) {
      setSelectedUserId(withUserId);
    }
  }, [withUserId, user?.id, selectedUserId]);

  useEffect(() => {
    if (withUserId && selectedUserId === withUserId) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("with");
          return next;
        },
        { replace: true }
      );
    }
  }, [withUserId, selectedUserId, setSearchParams]);
  const [draft, setDraft] = useState("");

  const { data: rawConversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["messages", "conversations", user?.id],
    queryFn: async (): Promise<ConversationListItem[]> => {
      const data = await api.service("message").getConversations();
      const list = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? [];
      return (list as ConversationListItem[]).map((c) => ({
        conversation_id: c.conversation_id,
        other_user_id: c.other_user_id,
        other_user_name: c.other_user_name ?? "",
        avatar_url: c.avatar_url ?? null,
        unread_count: Number(c.unread_count ?? 0),
        last_message: c.last_message ?? null,
        last_message_time: c.last_message_time ?? null,
      }));
    },
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  // Use conversations as-is; backend returns correct other_user_id (the other participant)
  const conversations = rawConversations;

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", "with", selectedUserId, user?.id],
    queryFn: () =>
      api.service("message").getWithUser(selectedUserId!, { limit: 100 }),
    enabled: !!user?.id && !!selectedUserId,
    refetchInterval: 4000,
  });

  // Mark conversation as read when user opens it
  useEffect(() => {
    const conv = conversations.find((c) => c.other_user_id === selectedUserId);
    if (conv?.conversation_id && conv.unread_count > 0) {
      const svc = api.service("conversation" as "message") as { markAsRead?: (id: string) => Promise<void> };
      svc.markAsRead?.(conv.conversation_id)
        ?.then(() => {
          queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
        })
        .catch(() => {});
    }
  }, [selectedUserId, conversations, queryClient]);

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      api.service("message").createMessage({
        recipientId: selectedUserId!,
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "with", selectedUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
      setDraft("");
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

  const selectedConversation = selectedUserId
    ? conversations.find((c) => c.other_user_id === selectedUserId)
    : null;
  const otherUser =
    selectedConversation
      ? { id: selectedConversation.other_user_id, email: "" }
      : selectedUserId
        ? { id: selectedUserId, email: "" }
        : null;

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !selectedUserId || sendMutation.isPending) return;
    sendMutation.mutate(text);
  };

  const filteredConversations =
    filter === "unread"
      ? conversations.filter((c) => c.unread_count > 0)
      : conversations;

  const handleSelectUser = (otherUserId: string) => {
    // Guard: selectedUserId must always be the OTHER participant, never myself
    if (user?.id && otherUserId === user.id) return;
    setSelectedUserId(otherUserId);
  };

  const showList = useBreakpointValue({
    base: !selectedUserId,
    md: true,
  });
  const showChat = useBreakpointValue({
    base: !!selectedUserId,
    md: true,
  });
console.log('filteredConversations:::', filteredConversations);
  return (
    <Container maxW="100%" px={[4, 8]} py={8}>
        <Flex
          height="calc(100vh - 180px)"
          minHeight="500px"
          maxWidth="1400px"
          margin="0 auto"
          bg="white"
          borderRadius="12px"
          boxShadow="sm"
          overflow="hidden"
        >
          {showList && (
            <Box flexShrink={0} height="100%" overflow="hidden">
              <ConversationList
                conversations={filteredConversations}
                selectedUserId={selectedUserId}
                currentUserId={user?.id ?? ""}
                currentUserRole={user?.role}
                onSelect={handleSelectUser}
                filter={filter}
                onFilterChange={setFilter}
              />
            </Box>
          )}
          {showChat && (
            <ChatPanel
              otherUser={otherUser}
              messages={messages}
              currentUserId={user?.id ?? ""}
              isLoading={!!selectedUserId && messagesLoading}
              isSending={sendMutation.isPending}
              draft={draft}
              onDraftChange={setDraft}
              onSend={handleSend}
              onBack={() => setSelectedUserId(null)}
            />
          )}
        </Flex>

    </Container>
  );
};
