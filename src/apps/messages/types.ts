/**
 * Local types for the new messages/conversations API.
 * Use these until @suleigolden/sulber-api-client is updated with the new types.
 */

export type ConversationListItem = {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  avatar_url: string | null;
  unread_count: number;
  last_message: string | null;
  last_message_time: string | null;
};
