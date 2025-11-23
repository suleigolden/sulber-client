import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";

type SelectionItem = {
  label: string;
  icon: React.ElementType;
  category: string;
};

type SelectionGridProps = {
  items: SelectionItem[];
  selectedItems: string[];
  onToggle: (label: string) => void;
  categoryTitle: string;
};

export function SelectionGrid({ items, selectedItems, onToggle, categoryTitle }: SelectionGridProps) {
  console.log(selectedItems);
  return (
    <Box w="100%">
      <Text fontSize="md" fontWeight="semibold" mb={4}>
        {categoryTitle}
      </Text>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {items?.map(({ label, icon: Icon }) => {
          const isSelected = selectedItems.includes(label);
        
          return (
            <Button
              key={label}
              onClick={() => onToggle(label)}
              variant="outline"
              leftIcon={<Icon />}
              bg={isSelected ? "brand.100" : "white"}
              borderColor={isSelected ? "brand.400" : "gray.300"}
              _hover={{ bg: isSelected ? "brand.200" : "gray.50" }}
              _active={{ transform: "scale(0.98)" }}
              borderWidth="1px"
              borderRadius="md"
              px={4}
              py={6}
              w="full"
              h="auto"
              justifyContent="flex-start"
              alignItems="center"
              flexDirection="column"
              gap={2}
            >
              <Text fontSize="sm" fontWeight="medium">
                {label}
              </Text>
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
} 