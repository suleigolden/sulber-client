import {
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";

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
  const bg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const _placeholder = useColorModeValue("gray.500", "gray.400");

  return (
    <InputGroup size="sm" bg={bg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
      <InputLeftElement pointerEvents="none" color={_placeholder}>
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
