
import { Button, Icon, useColorMode } from '@chakra-ui/react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export default function SystemThemeToggle(props: { [x: string]: any }) {
	const { ...rest } = props;
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Button
			{...rest}
			h='60px'
			w='60px'
			bg={'brand.500'}
			zIndex='99'
			position='fixed'
			variant='no-effects'
			left={document.documentElement.dir === 'rtl' ? '35px' : ''}
			right={document.documentElement.dir === 'rtl' ? '' : '35px'}
			bottom='30px'
			border='1px solid'
			borderColor='brand.500'
			borderRadius='50px'
			onClick={toggleColorMode}
			display='flex'
			p='0px'
			alignItems='center'
			justifyContent='center'>
			<Icon h='24px' w='24px' color='white' as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
		</Button>
	);
}
