import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useColorModeValue,
  Text,
  Box,
  Icon,
  HStack,
  Button,
  Select,
} from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { MdArrowDropUp, MdArrowDropDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

type DynamicTableProps<T> = {
  data: T[];
  columns: any[];
  itemsPerPage?: number;
};

export const DynamicTable = <T extends object>({
  data,
  columns,
  itemsPerPage = 10,
}: DynamicTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const headerBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: itemsPerPage,
      },
    },
  });

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box p={8} textAlign="center">
        <Text color="gray.500" fontSize="md">
          No data available
        </Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto" w="100%">
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  borderColor={borderColor}
                  cursor="pointer"
                  onClick={header.column.getToggleSortingHandler()}
                  bg={headerBg}
                  py={4}
                  px={6}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize="xs"
                    color={textColor}
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <Box ml={2}>
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <Icon as={MdArrowDropDown} w={4} h={4} />
                        ) : (
                          <Icon as={MdArrowDropUp} w={4} h={4} />
                        )
                      ) : null}
                    </Box>
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr 
              key={row.id}
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              {row.getVisibleCells().map((cell) => (
                <Td 
                  key={cell.id} 
                  fontSize="sm" 
                  py={4}
                  px={6}
                  borderBottom="1px"
                  borderColor={borderColor}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      <Flex justify="space-between" align="center" px={6} py={4}>
        <HStack spacing={2}>
          {/* <Button
            onClick={() => table.setPageIndex(0)}
            isDisabled={!table.getCanPreviousPage()}
            size="sm"
            variant="outline"
          >
            First
          </Button> */}
          <Button
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
            size="sm"
            variant="outline"
            colorScheme="brand"
            leftIcon={<MdKeyboardArrowLeft />}
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
            size="sm"
            variant="outline"
            colorScheme="brand"
            rightIcon={<MdKeyboardArrowRight />}
          >
            Next
          </Button>
          {/* <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
            size="sm"
            variant="outline"
          >
            Last
          </Button> */}
        </HStack>

        <HStack spacing={4}>
          <Text fontSize="sm" color={textColor}>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </Text>
          
          <Select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            size="sm"
            w="120px"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>
    </Box>
  );
};
