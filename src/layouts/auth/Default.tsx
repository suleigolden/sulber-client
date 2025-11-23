import { Box, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Footer from '../../components/footer/FooterAuth';
import SystemThemeToggle from '../../components/SystemThemeToggle';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../components/icons/Logo';
import { homePageLink } from '~/common/utils/home-page-link';
import { useUser } from '~/hooks/use-user';

export const DefaultAuthLayout = (props: { children: React.ReactNode }) => {
	const { children } = props;
	const {user} = useUser();
	return (
		<Flex position='relative' h='max-content'>
			<Flex
				h={{
					sm: 'initial',
					md: 'unset',
					lg: '100vh',
					xl: '97vh'
				}}
				w='100%'
				maxW={{ md: '66%', lg: '1313px' }}
				mx='auto'
				pt={{ sm: '50px', md: '0px' }}
				px={{ lg: '30px', xl: '0px' }}
				ps={{ xl: '70px' }}
				justifyContent='start'
				direction='column'>
				<NavLink
					to={homePageLink(user)}
					style={() => ({
						width: 'fit-content',
						marginTop: '40px'
					})}>
					<Flex align='center' ps={{ base: '25px', lg: '0px' }} pt={{ lg: '0px', xl: '0px' }} w='fit-content'>
						<Logo />
					</Flex>
				</NavLink>
				{children}
				<Box
					display={{ base: 'none', md: 'block' }}
					h='100%'
					minH='100vh'
					w={{ lg: '50vw', '2xl': '44vw' }}
					position='absolute'
					right='0px'>
					<Flex
						bg={`url(/images/about/about-img-0.png)`}
						// bg={'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'}
						justify='center'
						align='end'
						w='100%'
						h='100%'
						bgSize='cover'
						bgPosition='50%'
						position='absolute'
						borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
					/>
				</Box>
				<Footer />
			</Flex>
			<SystemThemeToggle />
		</Flex>
	);
}
// PROPS

DefaultAuthLayout.propTypes = {
	illustrationBackground: PropTypes.string,
	image: PropTypes.any
};


