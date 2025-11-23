import { useColorMode, useColorModeValue } from "@chakra-ui/react";



export const useSystemColor = () => {
  const { colorMode } = useColorMode();
  const isLightMode = colorMode === 'light';
  const mainTextColor = isLightMode ? 'secondaryGray.500' : 'white';
  const secondaryTextColor = isLightMode ? 'secondaryGray.500' : 'white';
  const brandColor = useColorModeValue('brand.500', 'white');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
  const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgList = useColorModeValue('white', 'whiteAlpha.100');


  return { 
          colorMode, 
          isLightMode, 
          mainTextColor, 
          secondaryTextColor, 
          brandColor, 
          bgButton, 
          bgHover,
          bgFocus,
          iconColor,
          bgList
      };
};
