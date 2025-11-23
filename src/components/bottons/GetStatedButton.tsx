import { Button, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';

export const GetStatedButton = () => {
  return (
    <Button
      as={'a'}
      href="/sign-in"
      size="lg"
      colorScheme="brand"
      px={8}
      fontSize="md"
      fontWeight="bold"
      alignSelf="end"
      mt={4}
      rightIcon={<Icon as={FaArrowRight} />}
    >
      Get Started Free
    </Button>
  );
};
