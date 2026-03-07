import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { useSystemColor } from "~/hooks/use-system-color";

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
  const { bgButton, textColor } = useSystemColor();

  return (
    <Flex gap={2} flexWrap="wrap">
      <ButtonGroup size="sm" variant="ghost" spacing={1}>
        {TABS.map(({ key, label }) => (
          <Button
            key={key}
            borderRadius="lg"
            bg={filter === key ? "brand.500" : bgButton}
            color={filter === key ? "white" : textColor}
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
