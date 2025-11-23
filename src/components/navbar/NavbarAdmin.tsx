import {
  Box,
  Collapse,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Logo } from "~/components/icons/Logo";
import { AdminNavbarLinks } from "./AdminNavbarLinks";
import { FC } from "react";
import { useUser } from "~/hooks/use-user";
import { homePageLink } from "~/common/utils/home-page-link";
import { getNavItems } from "~/common/constants/nav-items";

// Add this style object at the top of the file
const mobileNavStyles = {
  link: {
    py: 2,
    px: 4,
    borderRadius: "md",
    width: "100%",
    display: "block",
    _hover: {
      bg: "gray.50",
      color: "#6868f7",
    },
    transition: "all 0.2s",
  },
  button: {
    width: "100%",
    justifyContent: "flex-start",
    px: 4,
    py: 2,
    _hover: {
      bg: "#5959d4",
    },
  },
};

type AdminNavbarProps = {
  secondary: boolean;
  message: string | boolean;
  fixed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen: (...args: any[]) => any;
};
export const AdminNavbar: FC<AdminNavbarProps> = ({
  secondary,
  fixed,
  onOpen,
}) => {
  const { user } = useUser();
  const { isOpen, onToggle } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const linkColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
      zIndex={100}
    >
      <Container maxW="8xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Flex
            flex={{ base: 1 }}
            justify={{ base: "start", lg: "flex-start" }}
          >
            <Box
              as="span"
              cursor="pointer"
              onClick={() => (window.location.href = homePageLink(user))}
            >
              <Logo size={{ base: 39, lg: 32 }} />
            </Box>
          </Flex>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
            {getNavItems(user).map((navItem) => (
              <Box key={navItem.label}>
                {navItem.type === "link" ? (
                  <Link
                    as={RouterLink}
                    to={navItem.type === "link" ? `${navItem.href}` : "#"}
                    fontWeight="medium"
                    color={linkColor}
                    _hover={{ color: "brand.500" }}
                    cursor="pointer"
                  >
                    {navItem.label}
                  </Link>
                ) : (
                  <AdminNavbarLinks
                    onOpen={onOpen}
                    secondary={secondary}
                    fixed={fixed}
                    variant=""
                  />
                )}
              </Box>
            ))}
          </HStack>

          {/* Mobile Menu Button - Moved to the right */}
          <Flex
            flex={{ base: 1, lg: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", lg: "none" }}
            justify="flex-end"
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={9} h={9} />
                ) : (
                  <HamburgerIcon w={10} h={10} color="#6868f7" />
                )
              }
              variant="ghost"
              aria-label="Toggle Navigation"
              size={"6xl"}
              border={"1px solid #brand.500"}
              p={2}
            />
          </Flex>

          {/* Mobile Navigation - Updated */}
          <Collapse in={isOpen} animateOpacity>
            <Box
              bg={bgColor}
              display={{ base: "block", lg: "none" }}
              position="fixed"
              width="100%"
              left={0}
              top="64px"
              borderTopWidth="1px"
              borderColor={borderColor}
              boxShadow="lg"
              zIndex={999}
            >
              <Stack
                spacing={0}
                py={2}
                divider={
                  <Box borderBottom="1px" borderColor="gray.100" mx={4} />
                }
              >
                {getNavItems(user).map((navItem) => (
                  <Box key={navItem.label}>
                    {navItem.type === "link" ? (
                      <Link
                        as={RouterLink}
                        to={navItem.type === "link" ? `${navItem.href}` : "#"}
                        {...mobileNavStyles.link}
                      >
                        {navItem.label}
                      </Link>
                    ) : (
                      <AdminNavbarLinks
                        onOpen={onOpen}
                        secondary={secondary}
                        fixed={fixed}
                        variant=""
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Flex>
      </Container>
    </Box>
  );
};
