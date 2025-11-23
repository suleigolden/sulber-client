/*eslint-disable*/
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
  const textColor = useColorModeValue('gray.400', 'gray.400');
  const bgColor = useColorModeValue('gray.700', 'gray.700');
  const hoverColor = useColorModeValue('white', 'white');

  return (
    <Box  bg={bgColor}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            w="full"
            gap={4}
          >
            <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
              <Text
                color={textColor}
                fontSize="sm"
                textAlign={{ base: 'center', md: 'left' }}
              >
                &copy; {new Date().getFullYear()} HomiShare.
              </Text>
              <Text
                color={textColor}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={1}
              >
                Made with <Icon as={FaHeart} color="red.400" /> in London, UK
              </Text>
            </VStack>

            <List>
              <HStack
                spacing={{ base: 4, md: 8 }}
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

          <Text fontSize="xs" color={textColor} textAlign="center">
            All Rights Reserved. HomiShare is a registered trademark.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
