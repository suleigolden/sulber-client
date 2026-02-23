import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const theme = extendTheme({
  colors: {
    darkBg: '#0b1437',
    brand: {
      50: '#e6f7f6',
      100: '#b3ebe7',
      200: '#80dfd8',
      300: '#4dd3c9',
      400: '#2db5ab',
      500: '#24a89d', // Primary brand color (#24a89de6 solid)
      600: '#1e8f85',
      700: '#18766e',
      800: '#125d56',
      900: '#0c453f',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },
    gray: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#868e96',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E1E9F8',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#8F9BBA',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
  },
  components: {
    Button: {
      variants: {
        brand: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
          _active: {
            bg: 'brand.700',
          },
        },
        darkBrand: {
          bg: 'brand.900',
          color: 'white',
          _hover: {
            bg: 'brand.800',
          },
          _active: {
            bg: 'brand.700',
          },
        },
      },
    },
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      body: {
        bg: mode('white', '#0b1437')(props),
        color: mode('gray.800', 'white')(props),
      },
    }),
  },
});

export type CustomCardProps = {
  variant?: string;
  size?: string;
  [x: string]: any;
}; 