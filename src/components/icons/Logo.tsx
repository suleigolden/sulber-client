import { Text, useColorMode, ResponsiveValue } from '@chakra-ui/react';
import { FC } from 'react';

type LogoProps = {
  size?: ResponsiveValue<number>;
};

export const Logo: FC<LogoProps> = ({ size = 32 }) => {
  const { colorMode } = useColorMode();
  return (
    <Text
      as={'a'}
      href={'#'}
      fontSize={size}
      fontWeight={700}
      color={colorMode === 'light' ? '#001a62' : 'white'}
      ml={{ base: 0, sm: 1 }}
      mb={{ base: 0, sm: 4 }}
    >
      Sul
      <Text
        as={'span'}
        color={colorMode === 'light' ? 'brand.500' : 'white'}
        borderTop={colorMode === 'light' ? '2px #675dff solid' : '2px white solid'}
        borderBottom={colorMode === 'light' ? '2px #675dff solid' : '2px white solid'}
        borderRadius={9}
        fontWeight={700}
        p={'0 3px'}
      >
        Ber
      </Text>
      
    </Text>
  );
};
