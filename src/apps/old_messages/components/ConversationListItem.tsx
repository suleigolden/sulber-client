import { Box, Flex, Text, Avatar, Badge, useColorModeValue } from "@chakra-ui/react";
import type { ConversationListItem as ConversationListItemType } from "../../messages/types";

type ConversationListItemProps = {
  conversation: ConversationListItemType;
  /** "Provider" when viewer is customer; "Customer" when viewer is provider */
  roleLabel?: string | null;
  isSelected: boolean;
  onSelect: () => void;
  formatDate: (date: string | null) => string;
};

const PREVIEW_LENGTH = 50;

export const ConversationListItem = ({
  conversation,
  roleLabel,
  isSelected,
  onSelect,
  formatDate,
}: ConversationListItemProps) => {
  const selectedBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const nameColor = useColorModeValue("gray.800", "white");
  const previewColor = useColorModeValue("gray.600", "gray.400");
  const lastMessage = conversation.last_message ?? "";
  const preview =
    lastMessage.length > PREVIEW_LENGTH
      ? lastMessage.slice(0, PREVIEW_LENGTH) + "..."
      : lastMessage;

  return (
    <Box
      px="24px"
      py="14px"
      cursor="pointer"
      bg={isSelected ? selectedBg : "transparent"}
      _hover={{ bg: isSelected ? selectedBg : hoverBg }}
      onClick={onSelect}
      transition="background 0.15s"
    >
      <Flex gap="14px" align="flex-start">
        <Box position="relative">
          <Avatar
            size="md"
            name={conversation.other_user_name || "User"}
            src={conversation.avatar_url ?? undefined}
            flexShrink={0}
            bg="brand.400"
            color="white"
          />
          {conversation.unread_count > 0 && (
            <Badge
              position="absolute"
              top="-4px"
              right="-4px"
              colorScheme="red"
              borderRadius="full"
              fontSize="10px"
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {conversation.unread_count}
            </Badge>
          )}
        </Box>
        <Box flex="1" minWidth={0}>
          <Flex justify="space-between" align="center" gap="8px" mb="2px">
            <Flex align="center" gap="6px" minWidth={0}>
              <Text
                fontWeight="600"
                fontSize="15px"
                color={nameColor}
                noOfLines={1}
              >
                {conversation.other_user_name?.trim() || "User"}
              </Text>
              {roleLabel && (
                <Text
                  fontSize="11px"
                  color={previewColor}
                  flexShrink={0}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  {roleLabel}
                </Text>
              )}
            </Flex>
            <Text fontSize="13px" color={previewColor} flexShrink={0}>
              {formatDate(conversation.last_message_time)}
            </Text>
          </Flex>
          <Text
            fontSize="14px"
            color={previewColor}
            noOfLines={2}
            lineHeight="1.4"
          >
            {preview}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
