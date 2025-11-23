import {
  Box,
  Container,
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaHeart, FaEnvelope, FaFileAlt } from 'react-icons/fa';

export default function Footer() {
  const textColor = useColorModeValue('gray.600', 'white');
  const hoverColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box  position="relative" zIndex={3}>
      <Container maxW="7xl" py={6}>
        <VStack spacing={4}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            w="full"
            gap={4}
          >
            <Text
              color={textColor}
              fontSize="sm"
              textAlign={{ base: 'center', md: 'left' }}
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="center"
            >
              Made with <Icon as={FaHeart} color="red.400" /> by HomiShare 
              &copy; {new Date().getFullYear()}  All Rights Reserved
            </Text>

            <List>
              <HStack
                spacing={{ base: 4, md: 6 }}
                justify="center"
                flexWrap="wrap"
              >
                <ListItem>
                  <Link
                    href="/contact-us"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    color={textColor}
                    _hover={{ color: hoverColor, textDecoration: 'none' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaEnvelope} />
                    Contact Us
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/terms-of-service"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    color={textColor}
                    _hover={{ color: hoverColor, textDecoration: 'none' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaFileAlt} />
                    Terms of Service
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/privacy-policy"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    fontSize="sm"
                    color={textColor}
                    _hover={{ color: hoverColor, textDecoration: 'none' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaFileAlt} />
                    Privacy Policy
                  </Link>
                </ListItem>
              </HStack>
            </List>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
