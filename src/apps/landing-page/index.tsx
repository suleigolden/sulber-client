import { Box, Text } from '@chakra-ui/react';
import SystemThemeToggle from '../../components/SystemThemeToggle';
import { Navbar } from './Navbar';

export const LandingPage = () => {
  return (
    <Box>
      <Navbar />
      <SystemThemeToggle />
      <Text>Landing Page</Text>
    </Box>
  );
};
