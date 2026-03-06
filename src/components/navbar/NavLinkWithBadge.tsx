import { Box, Link, Badge, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@suleigolden/sulber-api-client";
import type { NavItem } from "~/common/constants/nav-items";

type NavLinkWithBadgeProps = {
  navItem: NavItem;
  linkProps?: Record<string, unknown>;
};

export const NavLinkWithBadge = ({ navItem, linkProps }: NavLinkWithBadgeProps) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");

  const { data: unreadData } = useQuery({
    queryKey: ["conversations", "total-unread"],
    queryFn: async () => {
      try {
        const svc = api.service("conversation" as "message") as {
          getTotalUnread?: () => Promise<{ total_unread: number }>;
        };
        return svc.getTotalUnread?.() ?? { total_unread: 0 };
      } catch {
        return { total_unread: 0 };
      }
    },
    enabled: !!navItem.showUnreadBadge,
    refetchInterval: 30000,
  });

  const unreadCount = unreadData?.total_unread ?? 0;

  return (
    <Box as="span" display="inline-flex" alignItems="center" gap={2}>
      <Link
        as={RouterLink}
        to={navItem.href ?? "#"}
        fontWeight="medium"
        color={linkColor}
        _hover={{ color: "brand.500" }}
        cursor="pointer"
        {...linkProps}
      >
        {navItem.label}
      </Link>
      {navItem.showUnreadBadge && unreadCount > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          fontSize="10px"
          minW="18px"
          h="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Box>
  );
};
