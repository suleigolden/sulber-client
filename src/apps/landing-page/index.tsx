import { Box, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SystemThemeToggle from '../../components/SystemThemeToggle';
import { Navbar } from './Navbar';
import Footer from '~/components/footer/FooterAuth';
import { HeroSection } from './HeroSection';
import { Suggestions } from './Suggestions';

export const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#hero') {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <Box>
      <Navbar />
      <SystemThemeToggle />
      <VStack align="start" spacing={8} w="full" mt={20}>
        <HeroSection />
        <Suggestions />
        <Footer />
      </VStack>
    </Box>
  );
};
