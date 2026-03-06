import { Box, Flex, Text, Avatar, useColorModeValue } from "@chakra-ui/react";
import type { Message } from "@suleigolden/sulber-api-client";
import { formatMessageTime } from "~/common/utils/date-time";

type MessageBubbleProps = {
  message: Message;
  isMine: boolean;
  showAvatarAndName?: boolean;
};

export const MessageBubble = ({
  message,
  isMine,
  showAvatarAndName = false,
}: MessageBubbleProps) => {
  const mineBg = useColorModeValue("gray.800", "gray.600");
  const theirsBg = useColorModeValue("gray.200", "gray.600");
  const timeColor = useColorModeValue("gray.500", "gray.400");
  const nameColor = useColorModeValue("gray.700", "gray.300");

  const displayName =
    message.sender?.email?.split("@")[0] || "User";
  const time = formatMessageTime(message.created_at);

  return (
    <Flex
      direction="column"
      align={isMine ? "flex-end" : "flex-start"}
      width="100%"
      maxWidth="75%"
      mt={showAvatarAndName ? "16px" : "8px"}
    >
      {!isMine && showAvatarAndName && (
        <Flex align="center" gap="8px" mb="4px">
          <Avatar
            size="xs"
            name={displayName}
            src={undefined}
            bg="brand.400"
            color="white"
          />
          <Text fontSize="13px" fontWeight="500" color={nameColor}>
            {displayName}
          </Text>
          <Text fontSize="12px" color={timeColor}>
            {time}
          </Text>
        </Flex>
      )}
      {isMine && (
        <Text fontSize="12px" color={timeColor} mb="4px" mr="4px">
          {time}
        </Text>
      )}
      <Box
        px="14px"
        py="10px"
        borderRadius="12px"
        bg={isMine ? mineBg : theirsBg}
        color={isMine ? "white" : undefined}
      >
        <Text fontSize="15px" lineHeight="1.5" whiteSpace="pre-wrap" wordBreak="break-word">
          {message.content}
        </Text>
      </Box>
    </Flex>
  );
}
