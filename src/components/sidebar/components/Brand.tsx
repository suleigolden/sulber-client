
import { Flex } from '@chakra-ui/react';
import { Logo } from '~/components/icons/Logo';
import { HSeparator } from '~/components/separator/Separator';

export function SidebarBrand() {

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Logo size={32} />
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
