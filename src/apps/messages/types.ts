/**
 * Local types for the new messages/conversations API.
 * Aligned with backend and @suleigolden/sulber-api-client.
 */

export type ConversationListItem = {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  avatar_url: string | null;
  unread_count: number;
  last_message: string | null;
  last_message_time: string | null;
  /** Id of the user who sent the last message (for Sent/Received filters). */
  last_message_sender_id?: string | null;
};
