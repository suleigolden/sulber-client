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
      color={colorMode === 'light' ? '#0b1437' : 'white'}
      ml={{ base: 0, sm: 1 }}
      mb={{ base: 0, sm: 4 }}
    >
      SulBer
    </Text>
  );
};
