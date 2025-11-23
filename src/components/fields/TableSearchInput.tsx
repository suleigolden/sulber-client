import { Input, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

type Props = {
  query: string;
  setQuery: (val: string) => void;
  placeholder?: string;
};

export const TableSearchInput = ({ query, setQuery, placeholder }: Props) => (
  <InputGroup maxW="300px">
    <InputLeftElement pointerEvents="none">
      <Icon as={MdSearch} color="gray.400" />
    </InputLeftElement>
    <Input
      type="text"
      placeholder={placeholder ?? 'Search...'}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      borderRadius="full"
    />
  </InputGroup>
);
