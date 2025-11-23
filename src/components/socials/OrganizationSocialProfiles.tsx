import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

type OrganizationSocialProfilesProps = {
    social_profiles: {
    [key: string]: string;
  };
};

export const OrganizationSocialProfiles = ({ social_profiles }: OrganizationSocialProfilesProps) => {
    if (!Object.entries(social_profiles).length) return <Flex gap={4} mt={1}><Text>No social profiles</Text> </Flex>;

    const socialIcons = {
      facebook: { icon: FaFacebook, color: 'blue.500', baseUrl: 'https://facebook.com/' },
      instagram: { icon: FaInstagram, color: 'pink.500', baseUrl: 'https://instagram.com/' },
      twitter: { icon: FaTwitter, color: 'blue.400', baseUrl: 'https://twitter.com/' },
      ticktock: { icon: FaTiktok, color: 'black', baseUrl: 'https://tiktok.com/@' },
    };

    return (
      <Flex gap={4} mt={2}>
        {Object.entries(social_profiles)
          .filter(([_, value]) => value)
          .map(([platform, handle]) => (
            <Icon
              key={platform}
              as={socialIcons[platform as keyof typeof socialIcons].icon}
              w={5}
              h={5}
              color={socialIcons[platform as keyof typeof socialIcons].color}
              cursor="pointer"
              onClick={() => window.open(socialIcons[platform as keyof typeof socialIcons].baseUrl + handle, '_blank')}
            />
          ))}
      </Flex>
    );
};
