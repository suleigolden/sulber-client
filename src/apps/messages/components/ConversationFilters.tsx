import { Button, ButtonGroup, Flex, useColorModeValue } from "@chakra-ui/react";

export type ConversationFilter = "all" | "unread" | "sent" | "received";

type ConversationFiltersProps = {
  filter: ConversationFilter;
  onFilterChange: (f: ConversationFilter) => void;
  totalUnread?: number;
};

const TABS: { key: ConversationFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "sent", label: "Sent" },
  { key: "received", label: "Received" },
];

/**
 * Tabs to filter conversation list: All, Unread, Sent, Received.
 */
export function ConversationFilters({
  filter,
  onFilterChange,
}: ConversationFiltersProps) {
  const activeBg = useColorModeValue("gray.800", "white");
  const activeColor = useColorModeValue("white", "gray.800");
  const inactiveBg = useColorModeValue("gray.100", "gray.700");
  const inactiveColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Flex gap={2} flexWrap="wrap">
      <ButtonGroup size="sm" variant="ghost" spacing={1}>
        {TABS.map(({ key, label }) => (
          <Button
            key={key}
            borderRadius="lg"
            bg={filter === key ? activeBg : inactiveBg}
            color={filter === key ? activeColor : inactiveColor}
            fontWeight="500"
            onClick={() => onFilterChange(key)}
            _hover={{ opacity: 0.9 }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </Flex>
  );
}
