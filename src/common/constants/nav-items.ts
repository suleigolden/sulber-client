import { User } from "@suleigolden/co-renting-api-client";


type NavItem = {
    label: string;
    children?: Array<NavItem>;
    href?: string;
    type: 'button' | 'link';
    isHandleNavigationLink?: string;
  };

export const getNavItems = (user: User) => {
  const OWNER_NAV_ITEMS: Array<NavItem> = [
    {
      label: "List your property",
      href: `/onboard/${user?.id}/property-onboard`,
      type: "link",
    },
    {
      label: "Listings",
      href: `/owner/${user?.id}/listings`,
      type: "link",
    },
    {
      label: "Listing Requests",
      href: `/owner/${user?.id}/accept-or-reject-listing-requests`,
      type: "link",
    },
    {
      label: "Sign In",
      href: "/sign-in",
      type: "button",
    },
  ];
  const RENTER_NAV_ITEMS: Array<NavItem> = [
    {
      label: "Listings",
      href: `/renter/${user?.id}/listings`,
      type: "link",
    },
    {
      label: "Listing Request",
      href: `/renter/${user?.id}/listing-request`,
      type: "link",
    },
    {
      label: "Profile Settings",
      href: `/renter/${user?.id}/profile-settings`,
      type: "link",
    },
    {
      label: "Log Out",
      href: "/logout",
      type: "button",
    },
  ];
  const PUBLIC_NAV_ITEMS: Array<NavItem> = [
    {
      label: "About",
      href: "/about",
      type: "link",
    },
    {
      label: "How It Works",
      href: "/how-it-works",
      type: "link",
      isHandleNavigationLink: "how-it-works",
    },
    {
      label: "Pricing",
      href: "/pricing",
      type: "link",
      isHandleNavigationLink: "pricing",
    },
    {
      label: "Use Cases",
      href: "/use-cases",
      type: "link",
      isHandleNavigationLink: "use-cases",
    },
    {
      label: "FAQ",
      href: "/faq",
      type: "link",
      isHandleNavigationLink: "faq",
    },
    {
      label: "Sign In",
      href: "/sign-in",
      type: "button",
    },
  ];

  return user?.role === "landlord"
    ? OWNER_NAV_ITEMS
    : user?.role === "renter"
    ? RENTER_NAV_ITEMS
    : PUBLIC_NAV_ITEMS;
};
