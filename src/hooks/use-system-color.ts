import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export const useSystemColor = () => {
  const { colorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  // Existing tokens
  const mainTextColor = isLightMode ? "secondaryGray.500" : "white";
  const secondaryTextColor = isLightMode ? "secondaryGray.500" : "white";
  const brandColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");

  // Common gray-based surface tokens used across many screens
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const mutedTextColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("gray.900", "white");
  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const subtextColor = useColorModeValue("gray.600", "gray.400");
  const inputBorderColor = useColorModeValue("gray.300", "whiteAlpha.300");
  const modalBg = useColorModeValue("white", "#0b1437");
  const subHeadingColor = useColorModeValue("gray.800", "white");
  const bodyColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "white");
  const iconMutedColor = useColorModeValue("gray.400", "gray.500");
  const errorTextColor = useColorModeValue("gray.600", "gray.400");
  const infoBoxBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const infoBoxBorder = useColorModeValue("blue.200", "blue.700");
  const infoBoxTextColor = useColorModeValue("blue.800", "blue.200");
  const selectedCardBg = useColorModeValue("brand.50", "whiteAlpha.200");
  const menuItemHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const menuButtonHover = useColorModeValue("gray.100", "whiteAlpha.200");
  const menuButtonActive = useColorModeValue("gray.200", "whiteAlpha.300");

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
    bgList,
    borderColor,
    labelColor,
    textColor,
    mutedTextColor,
    headingColor,
    dividerColor,
    linkColor,
    subtextColor,
    inputBorderColor,
    modalBg,
    subHeadingColor,
    bodyColor,
    valueColor,
    iconMutedColor,
    errorTextColor,
    infoBoxBg,
    infoBoxBorder,
    infoBoxTextColor,
    selectedCardBg,
    menuItemHover,
    menuButtonHover,
    menuButtonActive,
  };
};
