import { Box, Text, VStack } from '@chakra-ui/react';
import SystemThemeToggle from '../../components/SystemThemeToggle';
import { Navbar } from './Navbar';
import { RequestACarService } from '../car-service/RequestACarService';

export const LandingPage = () => {
  return (
    <Box>
      <Navbar />
      <SystemThemeToggle />
      <VStack align="start" spacing={8} w="full" mt={20}>
        <RequestACarService />
      </VStack>
    </Box>
  );
};
