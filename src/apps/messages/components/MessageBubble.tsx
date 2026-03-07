import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { formatMessageTime } from "~/common/utils/date-time";
import type { Message } from "@suleigolden/sulber-api-client";
import { FiCheck, FiCheckCircle } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { useSystemColor } from "~/hooks/use-system-color";

type MessageBubbleProps = {
  message: Message;
  isMine: boolean;
  showAvatarAndName?: boolean;
  senderDisplayName?: string;
};

/**
 * Single message bubble: text, time, and read indicator for sent messages.
 */
export function MessageBubble({
  message,
  isMine,
  showAvatarAndName = false,
  senderDisplayName = "User",
}: MessageBubbleProps) {
  const mineBg = useColorModeValue("brand.500", "brand.600");
  const { bgList, subtextColor, textColor } = useSystemColor();

  const text =
    (message as { message_text?: string }).message_text ??
    (message as { content?: string }).content ??
    "";
  const sentAt =
    (message as { sent_at?: string }).sent_at ??
    (message as { created_at?: string }).created_at ??
    "";
  const isRead = (message as { is_read?: boolean }).is_read ?? false;

  return (
    <Flex
      direction="column"
      align={isMine ? "flex-end" : "flex-start"}
      w="100%"
      maxW="85%"
      mt={showAvatarAndName ? 4 : 2}
    >
      {!isMine && showAvatarAndName && (
        <Text fontSize="xs" fontWeight="500" color={textColor} mb={1}>
          {senderDisplayName}
        </Text>
      )}
      <Box
        px={4}
        py={2.5}
        borderRadius="2xl"
        borderTopRightRadius={isMine ? "6px" : "2xl"}
        borderTopLeftRadius={isMine ? "2xl" : "6px"}
        bg={isMine ? mineBg : bgList}
        color={isMine ? "white" : textColor}
        boxShadow="sm"
      >
        <Text
          fontSize="sm"
          lineHeight="1.5"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          {text}
        </Text>
      </Box>
      <Flex
        align="center"
        gap={1}
        mt={1}
        justifyContent={isMine ? "flex-end" : "flex-start"}
      >
        <Text fontSize="xs" color={subtextColor}>
          {formatMessageTime(sentAt)}
        </Text>
        {isMine && (
          <Icon
            as={isRead ? FiCheckCircle : FiCheck}
            boxSize={3.5}
            color={subtextColor}
            ml={0.5}
            title={isRead ? "Read" : "Sent"}
          />
        )}
      </Flex>
    </Flex>
  );
}
