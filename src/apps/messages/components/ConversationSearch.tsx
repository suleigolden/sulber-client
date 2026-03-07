import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { useSystemColor } from "~/hooks/use-system-color";

type ConversationSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * Search input for filtering conversations by name or message preview.
 */
export function ConversationSearch({
  value,
  onChange,
  placeholder = "Search conversations",
}: ConversationSearchProps) {
  const { bgButton, borderColor, subtextColor } = useSystemColor();

  return (
    <InputGroup size="sm" bg={bgButton} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <InputLeftElement pointerEvents="none" color={subtextColor}>
        <Icon as={FiSearch} boxSize="16px" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        border="none"
        _focus={{ boxShadow: "none" }}
        pl="36px"
      />
    </InputGroup>
  );
}
