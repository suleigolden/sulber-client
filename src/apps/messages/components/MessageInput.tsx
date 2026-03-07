import {
  Box,
  Textarea,
  Button,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowUp, FiZap } from "react-icons/fi";
import { useSystemColor } from "~/hooks/use-system-color";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
  placeholder?: string;
};

/**
 * Message input matching the design: single rounded container with
 * "Write a message" placeholder, two teal icon pills (top-right), and
 * a circular black send button with upward arrow (bottom-right).
 */
export function MessageInput({
  value,
  onChange,
  onSend,
  isSending = false,
  placeholder = "Write a message",
}: MessageInputProps) {
  const { borderColor, modalBg, subtextColor, textColor } = useSystemColor();
  const sendButtonBg = useColorModeValue("black", "white");
  const sendButtonColor = useColorModeValue("white", "black");
  const tealPillBg = useColorModeValue("brand.500", "brand.400");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      px={{ base: 2, md: 4 }}
      py={2}
      flexShrink={0}
      bg="inherit"
    >
      <Box
        position="relative"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        bg={modalBg}
        minH="72px"
        overflow="hidden"
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={7}
          // minH="72px"
          maxH="120px"
          resize="none"
          bg="transparent"
          border="none"
          borderRadius="2xl"
          py={4}
          pl={5}
          pr={{ base: "100px", sm: "112px" }}
          pb="52px"
          pt={4}
          _placeholder={{ color: subtextColor }}
          _focus={{ boxShadow: "none" }}
          fontSize="md"
          color={textColor}
        />

        {/* Top-right: two teal icon pills */}
        <Flex
          position="absolute"
          top={3}
          right={4}
          gap={2}
          align="center"
          pointerEvents="none"
        >
          <Box
            as="button"
            type="button"
            aria-label="Suggestions"
            borderRadius="lg"
            bg={tealPillBg}
            color="white"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="auto"
            _hover={{ opacity: 0.9 }}
          >
            <Icon as={FiZap} boxSize={4} />
          </Box>
          <Box
            as="button"
            type="button"
            aria-label="Grammar"
            borderRadius="lg"
            bg={tealPillBg}
            color="white"
            w="32px"
            h="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            fontWeight="700"
            pointerEvents="auto"
            _hover={{ opacity: 0.9 }}
          >
            G
          </Box>
        </Flex>

        {/* Bottom-right: circular send button */}
        <Button
          position="absolute"
          bottom={3}
          right={4}
          borderRadius="full"
          bg={sendButtonBg}
          color={sendButtonColor}
          size="lg"
          minW="44px"
          h="44px"
          p={0}
          aria-label="Send"
          onClick={onSend}
          isLoading={isSending}
          isDisabled={!value.trim()}
          _hover={{ opacity: 0.9 }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          <Icon as={FiArrowUp} boxSize={5} />
        </Button>
      </Box>
    </Box>
  );
}
