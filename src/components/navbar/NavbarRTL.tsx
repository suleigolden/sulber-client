/* eslint-disable */
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Link,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { AdminNavbarLinks } from '~/components/navbar/AdminNavbarLinks';

export default function AdminNavbar(props: {
	secondary: boolean;
	message: string | boolean;
	brandText: string;
	logoText: string;
	fixed: boolean;
	onOpen: (...args: any[]) => any;
}) {
	const [scrolled, setScrolled] = useState(false);
	const { colorMode } = useColorMode();
	const isLightMode = colorMode === 'light';

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, brandText } = props;

	// Styles based on color mode
	const mainText = isLightMode ? 'navy.700' : 'white';
	const secondaryText = isLightMode ? 'gray.700' : 'white';
	const navbarBg = isLightMode
		? 'rgba(244, 247, 254, 0.2)'
		: 'rgba(11,20,55,0.5)';
	const navbarBorder = 'transparent';
	const navbarShadow = 'none';
	const navbarBackdrop = 'blur(20px)';
	const paddingX = '15px';
	const secondaryMargin = '0px';
	const gap = '0px';

	const changeNavbar = () => {
		setScrolled(window.scrollY > 1);
	};

	return (
		<Box
			position="fixed"
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter="none"
			backdropFilter={navbarBackdrop}
			backgroundPosition="center"
			backgroundSize="cover"
			borderRadius="16px"
			borderWidth="1.5px"
			borderStyle="solid"
			transitionDelay="0s"
			transitionDuration="0.25s"
			transitionProperty="box-shadow, background-color, filter, border"
			transitionTimingFunction="linear"
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH="75px"
			justifyContent={{ xl: 'center' }}
			lineHeight="25.6px"
			mx="auto"
			mt={secondaryMargin}
			pb="8px"
			left={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: paddingX,
				md: '10px',
			}}
			ps={{
				xl: '12px',
			}}
			pt="8px"
			top={{ base: '12px', md: '16px', xl: '18px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)',
			}}
		>
			<Flex
				w="100%"
				flexDirection={{
					sm: 'column',
					md: 'row',
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}
			>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
							<BreadcrumbLink href="#" color={secondaryText}>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize="sm">
							<BreadcrumbLink href="#" color={secondaryText}>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Navbar brand based on route name */}
					<Link
						color={mainText}
						href="#"
						bg="inherit"
						borderRadius="inherit"
						fontWeight="bold"
						fontSize="34px"
						_hover={{ color: mainText }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent',
						}}
						_focus={{
							boxShadow: 'none',
						}}
					>
						{brandText}
					</Link>
				</Box>
				<Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						secondary={props.secondary}
						fixed={props.fixed}
						variant=""
					/>
				</Box>
			</Flex>
		</Box>
	);
}
