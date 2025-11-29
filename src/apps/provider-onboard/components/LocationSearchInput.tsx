import { FC, useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdLocationOn } from 'react-icons/md';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { loadGoogleMapsScript } from '~/common/utils/loadGoogleMapsScript';

type LocationSearchInputProps = {
  onLocationSelect: (location: { 
    lat: number; 
    lng: number; 
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } | null) => void;
  initialValue?: string;
};

export const LocationSearchInput: FC<LocationSearchInputProps> = ({ onLocationSelect, initialValue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const bgDropdown = useColorModeValue('white', 'navy.800');
  const hoverBg = useColorModeValue('gray.100', 'navy.700');
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
    loadGoogleMapsScript()
    .then(() => setIsScriptLoaded(true))
    .catch((err) => console.error('Google Maps script failed to load', err));
    };

    // Check if already loaded
    checkGoogleMapsLoaded();

    // If not loaded, wait for it
    if (!isScriptLoaded) {
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      script?.addEventListener('load', checkGoogleMapsLoaded);
    }
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    cache: 24 * 60 * 60,
    initOnMount: isScriptLoaded,
  });

  // Set initial value when component mounts or initialValue changes
  useEffect(() => {
    if (initialValue && ready && isScriptLoaded && !value) {
      setValue(initialValue, false);
    }
  }, [initialValue, ready, isScriptLoaded, setValue, value]);

  const handleSelect = async (suggestion: any) => {
    setValue(suggestion.description, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Extract address components from geocode results
      const addressComponents = results[0].address_components || [];
      let city = '';
      let state = '';
      let country = '';
      let postalCode = '';

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.short_name || component.long_name;
        } else if (types.includes('country')) {
          country = component.short_name || component.long_name;
        } else if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      });

      onLocationSelect({ 
        lat, 
        lng, 
        address: suggestion.description,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        postalCode: postalCode || undefined,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <Box position="relative" width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <MdLocationOn color="gray.300" />
        </InputLeftElement>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value) {
              onLocationSelect(null);
            }
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={!ready}
          placeholder="Search by location..."
          borderColor="brand.500"
          _focus={{ borderColor: 'brand.600', boxShadow: '0 0 0 1px brand.600' }}
        />
      </InputGroup>

      {isOpen && status === 'OK' && (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg={bgDropdown}
          borderRadius="md"
          boxShadow="lg"
          zIndex={10}
          maxH="300px"
          overflowY="auto"
        >
          {data.map((suggestion) => (
            <ListItem
              key={suggestion.place_id}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              onClick={() => handleSelect(suggestion)}
            >
              <Text fontSize="sm">{suggestion.description}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}; 