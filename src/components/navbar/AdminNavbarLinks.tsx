import { FC } from 'react';
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { useSignOut } from '~/hooks/use-sign-out';
import { useUser } from '~/hooks/use-user';

type AdminNavbarLinksProps = {
  variant: string;
  fixed: boolean;
  secondary: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen: any;
};

export const AdminNavbarLinks: FC<AdminNavbarLinksProps> = (props: {
  secondary: boolean;
}) => {
  const { secondary } = props;
  const { user } = useUser();
  // const {newCredits} = useCredits();
  const signOut = useSignOut();
  const { colorMode, toggleColorMode } = useColorMode();
  const isLightMode = colorMode === 'light';
  const navbarIcon = isLightMode ? 'gray.400' : 'white';
  const menuBg = isLightMode ? 'white' : 'navy.800';
  const textColor = isLightMode ? 'secondaryGray.900' : 'white';
  const borderColor = isLightMode ? '#E6ECFA' : 'rgba(135, 140, 189, 0.3)';
  const shadow = isLightMode
    ? '14px 17px 40px 4px rgba(112, 144, 176, 0.18)'
    : '14px 17px 40px 4px rgba(112, 144, 176, 0.06)';


  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      // bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      // boxShadow={shadow}
    >
      {/* <Tooltip label="Account Credits" placement="bottom">
        <HStack
          spacing={3}
          p={2}
          rounded="md"
          _hover={{ bg: 'gray.50' }}
          transition="all 0.2s"
        >
          <Tooltip placement="bottom">
            <Badge
              as={'a'}
              href={billingPath}
              display="flex"
              alignItems="center"
              px={2}
              py={1}
              borderRadius="full"
              colorScheme="brand"
              variant="subtle"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.05)',
                bg: 'yellow.100',
              }}
              border="1px solid"
              borderColor="blue.500"
            >
              <Icon as={FaCoins} color="yellow.500" mr={1} />
              <Text>{formatNumberWithCommas(newCredits ?? 0)}</Text>
            </Badge>
          </Tooltip>
        </HStack>
      </Tooltip> */}
      {/* <Menu>
        <MenuButton p="0px" as={'a'} href={billingPath}>
          Upgrade
        </MenuButton>
      </Menu> */}
      {/* <Menu> */}
      {/* <MenuButton p="0px">
					<Icon mt="6px" as={MdNotificationsNone} color={navbarIcon} w="18px" h="18px" me="10px" />
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p="20px"
					borderRadius="20px"
					bg={menuBg}
					border="none"
					mt="22px"
					me={{ base: '30px', md: 'unset' }}
					minW={{ base: 'unset', md: '400px', xl: '450px' }}
					maxW={{ base: '360px', md: 'unset' }}
				>
					<Flex w="100%" mb="20px">
						<Text fontSize="md" fontWeight="600" color={textColor}>
							Notifications
						</Text>
						<Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer">
							Mark all read
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} px="0" borderRadius="8px" mb="10px">
							<ItemContent info="Horizon UI Dashboard PRO" />
						</MenuItem>
						<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} px="0" borderRadius="8px" mb="10px">
							<ItemContent info="Horizon Design System Free" />
						</MenuItem>
					</Flex>
				</MenuList> */}
      {/* </Menu> */}
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        ml={4}
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={`${user?.first_name} ${user?.last_name}`}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; {` ${user?.first_name}`}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              as={"a"}
              href={`/owner/${user?.id}/profile-settings`}
            >
              <Text fontSize="sm">Profile Settings</Text>
            </MenuItem>
            {/* <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Newsletter Settings</Text>
            </MenuItem> */}
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={signOut}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
};
