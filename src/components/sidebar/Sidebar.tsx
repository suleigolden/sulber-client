import React from 'react';
import {
	Box,
	Flex,
	Drawer,
	DrawerBody,
	Icon,
	useColorModeValue,
	DrawerOverlay,
	useDisclosure,
	DrawerContent,
	DrawerCloseButton
} from '@chakra-ui/react';
import Content from '~/components/sidebar/components/Content';
import { renderThumb, renderTrack, renderView } from '~/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { IoMenuOutline } from 'react-icons/io5';

function Sidebar(props: { routes: RoutesType[] }) {
	const { routes } = props;
	const variantChange = '0.2s linear';
	const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	const sidebarBg = useColorModeValue('white', 'navy.800');
	const sidebarMargins = '0px';


	return (
		<Box display={{ sm: 'none', xl: 'block' }} position='fixed' minH='100%'>
			<Box
				bg={sidebarBg}
				transition={variantChange}
				w='300px'
				h='100vh'
				m={sidebarMargins}
				minH='100%'
				overflowX='hidden'
				boxShadow={shadow}>
				<Scrollbars
					autoHide
					renderTrackVertical={renderTrack}
					renderThumbVertical={renderThumb}
					renderView={renderView}>
					<Content routes={routes} />
				</Scrollbars>
			</Box>
		</Box>
	);
}

export function SidebarResponsive(props: { routes: RoutesType[] }) {
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const menuColor = useColorModeValue('white', 'white');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef<HTMLDivElement>(null);
	const { routes } = props;


	return (
		<Flex display={{ sm: 'flex', xl: 'none' }} alignItems='center'>
			<Flex 
				ref={btnRef} 
				w='max-content' 
				h='max-content' 
				onClick={onOpen}
				position="fixed"
				top="20px"
				left="20px"
				zIndex={99}
			>
				<Icon
					as={IoMenuOutline}
					color={menuColor}
					my='auto'
					w={34}
					h={34}
					me='10px'
					_hover={{ 
						cursor: 'pointer',
						transform: 'scale(1.1)',
						transition: 'all 0.2s ease-in-out'
					}}
					bg="brand.500"
					borderRadius="md"
					boxShadow="0px 4px 12px rgba(0, 0, 0, 0.25)"
				/>
			</Flex>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
				placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
				finalFocusRef={btnRef}>
				<DrawerOverlay />
				<DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
					<DrawerCloseButton
						zIndex='3'
						onClick={onClose}
						_focus={{ boxShadow: 'none' }}
						_hover={{ boxShadow: 'none' }}
					/>
					<DrawerBody maxW='285px' px='0rem' pb='0'>
						<Scrollbars
							autoHide
							renderTrackVertical={renderTrack}
							renderThumbVertical={renderThumb}
							renderView={renderView}>
							<Content routes={routes} />
						</Scrollbars>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}

export default Sidebar;
