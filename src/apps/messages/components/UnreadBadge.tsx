import { Badge } from "@chakra-ui/react";

type UnreadBadgeProps = {
  count: number;
};

/**
 * Badge showing unread message count. Hidden when count is 0.
 */
export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count <= 0) return null;
  return (
    <Badge
      colorScheme="red"
      borderRadius="full"
      fontSize="xs"
      minW="20px"
      h="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="600"
      flexShrink={0}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
