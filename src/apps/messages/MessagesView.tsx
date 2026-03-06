import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Flex, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { ConversationList } from "./components/ConversationList";
import { ChatPanel } from "./components/ChatPanel";
import { Box, useBreakpointValue } from "@chakra-ui/react";

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

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["messages", "conversations", user?.id],
    queryFn: () => api.service("message").getConversations(),
    enabled: !!user?.id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", "with", selectedUserId, user?.id],
    queryFn: () =>
      api.service("message").getWithUser(selectedUserId!, { limit: 100 }),
    enabled: !!user?.id && !!selectedUserId,
  });

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
    ? conversations.find((c) => c.otherUser.id === selectedUserId)
    : null;
  const otherUser =
    selectedConversation?.otherUser ??
    (selectedUserId ? { id: selectedUserId, email: "" } : null);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !selectedUserId || sendMutation.isPending) return;
    sendMutation.mutate(text);
  };

  const filteredConversations =
    filter === "unread"
      ? conversations.filter(() => true)
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

  return (
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
  );
};
