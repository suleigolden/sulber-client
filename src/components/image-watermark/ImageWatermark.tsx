import { Box, Text, Image, forwardRef, ImageProps } from '@chakra-ui/react';
import { CustomCardProps } from 'theme/theme';

// type ImageWatermarkProps = ImageProps & CustomCardProps;
type ImageWatermarkProps = ImageProps & CustomCardProps & {
  type?: 'landing-page' | 'about-page';
};
export const ImageWatermark = forwardRef<ImageWatermarkProps, 'image'>(
  (props, ref) => {
    const { size, variant, ...rest } = props;

    return (
      <>
        <Box
          position="absolute"
          mt={'100px'}
          ml={props.type === 'landing-page' ? '850px' : '100px'}
          transform="translate(-50%, -50%) rotate(-45deg)"
          zIndex={2}
          width="100%"
          textAlign="center"
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
            fontWeight="bold"
            color="white"
            opacity={0.4}
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            HomiShare
          </Text>
        </Box>
        <Image ref={ref} {...rest} />
        <Box
          position="absolute"
          mt={'-100px'}
          ml={'400px'}
          transform={props.type === 'landing-page' ? "" : "translate(-50%, -50%) rotate(0deg)"}
          zIndex={2}
          width="100%"
          textAlign="center"
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
            fontWeight="bold"
            color="white"
            opacity={0.4}
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            HomiShare
          </Text>
        </Box>
      </>
    );
  },
);
