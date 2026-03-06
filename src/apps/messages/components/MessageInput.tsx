import {
  Box,
  Textarea,
  Button,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSend, FiPaperclip } from "react-icons/fi";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
  placeholder?: string;
};

/**
 * Fixed bottom input: multiline textarea, send button, optional attachment placeholder.
 * Send disabled when input is empty.
 */
export function MessageInput({
  value,
  onChange,
  onSend,
  isSending = false,
  placeholder = "Write a message...",
}: MessageInputProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={4}
      borderTopWidth="1px"
      borderColor={borderColor}
      flexShrink={0}
      bg="inherit"
    >
      <Flex gap={2} align="flex-end">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          minH="44px"
          maxH="120px"
          resize="none"
          bg={inputBg}
          border="none"
          borderRadius="xl"
          _focus={{ boxShadow: "none" }}
          fontSize="sm"
          pr="12"
        />
        <Flex align="center" gap={1} flexShrink={0}>
          <Button
            variant="ghost"
            size="sm"
            p={2}
            aria-label="Attach"
            flexShrink={0}
          >
            <Icon as={FiPaperclip} boxSize={5} />
          </Button>
          <Button
            size="sm"
            colorScheme="brand"
            borderRadius="full"
            p={2.5}
            aria-label="Send"
            onClick={onSend}
            isLoading={isSending}
            isDisabled={!value.trim()}
          >
            <Icon as={FiSend} boxSize={5} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
