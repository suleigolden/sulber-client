import {
  Container,
  Heading,
  VStack,
  HStack,
  Select,
  Text,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { User } from "@suleigolden/sulber-api-client";
import { DynamicTable } from "~/components/table/DynamicTable";
import { TableSearchInput } from "~/components/fields/TableSearchInput";
import { useCustomers } from "~/hooks/use-customers";
import { useSystemColor } from "~/hooks/use-system-color";

function getDisplayName(user: User): string {
  const first = user.profile?.first_name?.trim();
  const last = user.profile?.last_name?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return user.email;
}

function getPhone(user: User): string {
  return user.profile?.phone_number || user.phone || "—";
}

// Column defs for DynamicTable (TanStack Table); typed for User rows
const customerColumns = [
  {
    id: "name",
    accessorFn: getDisplayName,
    header: "Name",
    cell: (ctx: { row: { original: User } }) => (
      <Text fontSize="sm">{getDisplayName(ctx.row.original)}</Text>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (ctx: { getValue: () => unknown }) => (
      <Text fontSize="sm" noOfLines={1} title={String(ctx.getValue())}>
        {String(ctx.getValue())}
      </Text>
    ),
  },
  {
    id: "phone",
    accessorFn: getPhone,
    header: "Phone",
    cell: (ctx: { row: { original: User } }) => (
      <Text fontSize="sm">{getPhone(ctx.row.original)}</Text>
    ),
  },
  {
    id: "status",
    accessorFn: (row: User) => row.is_active,
    header: "Status",
    cell: (ctx: { row: { original: User } }) => (
      <Text fontSize="sm">{ctx.row.original.is_active ? "Active" : "Inactive"}</Text>
    ),
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created",
    cell: (ctx: { getValue: () => unknown }) => {
      const val = ctx.getValue();
      if (!val) return "—";
      const d = val instanceof Date ? val : new Date(val as string);
      return (
        <Text fontSize="sm">
          {Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()}
        </Text>
      );
    },
  },
];

export const SystemAdminManageCustomers = () => {
  const { customers, isLoading, error } = useCustomers();
  const { headingColor, mutedTextColor } = useSystemColor();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() => {
    let list = customers;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => {
        const name = getDisplayName(u).toLowerCase();
        const email = (u.email ?? "").toLowerCase();
        const phone = getPhone(u).toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }
    if (statusFilter === "active") list = list.filter((u) => u.is_active);
    if (statusFilter === "inactive") list = list.filter((u) => !u.is_active);
    return list;
  }, [customers, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Spinner size="lg" color="brand.500" />
          <Text color={mutedTextColor}>Loading customers…</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Heading size="md" color="red.500">
            Could not load customers
          </Heading>
          <Text color={mutedTextColor}>{error}</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={6} w="full" mt={10}>
        <Heading size="lg" color={headingColor}>
          Manage customers
        </Heading>

        <HStack wrap="wrap" spacing={4} w="full" justify="space-between">
          <HStack spacing={4}>
            <TableSearchInput
              query={searchQuery}
              setQuery={setSearchQuery}
              placeholder="Search by name, email, phone…"
            />
            <Select
              size="sm"
              w="140px"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </HStack>
          <Text fontSize="sm" color={mutedTextColor}>
            {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
          </Text>
        </HStack>

        <Box w="full">
          <DynamicTable
            data={filtered}
            columns={customerColumns}
            itemsPerPage={10}
          />
        </Box>
      </VStack>
    </Container>
  );
};
