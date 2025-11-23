import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6e6ff',
      100: '#c2c2ff',
      200: '#9e9eff',
      300: '#7a7aff',
      400: '#5656ff',
      500: '#6868f7', // Primary brand color
      600: '#5959d4', // Darker shade for hover
      700: '#4a4ab0',
      800: '#3b3b8d',
      900: '#2c2c6a',
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
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
});

export type CustomCardProps = {
  variant?: string;
  size?: string;
  [x: string]: any;
}; 