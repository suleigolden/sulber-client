import { Box, Textarea, Button, Icon, Flex } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { useSystemColor } from "~/hooks/use-system-color";

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
  const { borderColor, bgButton } = useSystemColor();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      // px={{ base: 4, md: 6 }}
      // py={4}
      borderTopWidth="2px"
      borderColor={borderColor}
      flexShrink={0}
      bg="inherit"
    >
      <Flex gap={2} align="flex-end"  bg={bgButton}>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          minH="74px"
          maxH="120px"
          resize="none"
          bg={'transparent'}
          border="none"
          _focus={{ boxShadow: "none" }}
          fontSize="md"
          pr="12"
        />
        <Flex align="center" gap={3} flexShrink={0} border="1px solid #24a89d">
          <Button
            size="xl"
            colorScheme="brand"
            borderRadius="full"
            mr={2}
            mt={-10}
            p={2.5}
            aria-label="Send"
            onClick={onSend}
            isLoading={isSending}
            isDisabled={!value.trim()}
            bg="red.500"
          >
            <Icon as={FiSend} boxSize={7} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
