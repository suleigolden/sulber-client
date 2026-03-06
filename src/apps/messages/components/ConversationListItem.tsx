import { Box, Flex, Text, Avatar, useColorModeValue } from "@chakra-ui/react";

type ConversationListItemProps = {
  otherUser: { id: string; email: string };
  lastMessage: {
    id: string;
    content: string;
    created_at: string;
    sentByMe: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
  formatDate: (date: string) => string;
};

const PREVIEW_LENGTH = 50;

export const ConversationListItem = ({
  otherUser,
  lastMessage,
  isSelected,
  onSelect,
  formatDate,
}: ConversationListItemProps) => {
  const selectedBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const nameColor = useColorModeValue("gray.800", "white");
  const previewColor = useColorModeValue("gray.600", "gray.400");

  const displayName = otherUser.email?.split("@")[0] || "User";
  const preview =
    lastMessage.content.length > PREVIEW_LENGTH
      ? lastMessage.content.slice(0, PREVIEW_LENGTH) + "..."
      : lastMessage.content;

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
        <Avatar
          size="md"
          name={displayName}
          src={undefined}
          flexShrink={0}
          bg="brand.400"
          color="white"
        />
        <Box flex="1" minWidth={0}>
          <Flex justify="space-between" align="center" gap="8px" mb="2px">
            <Text
              fontWeight="600"
              fontSize="15px"
              color={nameColor}
              noOfLines={1}
            >
              {displayName}
            </Text>
            <Text fontSize="13px" color={previewColor} flexShrink={0}>
              {formatDate(lastMessage.created_at)}
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
