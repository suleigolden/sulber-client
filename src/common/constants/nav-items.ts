import { User } from "@suleigolden/sulber-api-client";


type NavItem = {
    label: string;
    children?: Array<NavItem>;
    href?: string;
    type: 'button' | 'link';
    isHandleNavigationLink?: string;
  };

export const getNavItems = (user: User) => {
  const PROVIDER_NAV_ITEMS: Array<NavItem> = [
    // {
    //   label: "Complete Your Profile",
    //   href: `/onboard/${user?.id}/property-onboard`,
    //   type: "link",
    // },
    // {
    //   label: "Service Requests",
    //   href: `/provider/${user?.id}/service-requests`,
    //   type: "link",
    // },
    {
      label: "Manage Requests",
      href: `/provider/${user?.id}/accept-or-reject-listing-requests`,
      type: "link",
    },
    {
      label: "Payment History",
      href: `/provider/${user?.id}/payment-history`,
      type: "link",
    },
    {
      label: "Log Out",
      href: "/logout",
      type: "button",
    },
  ];
  const CUSTOMER_NAV_ITEMS: Array<NavItem> = [
    {
      label: "Manage Requests",
      href: `/customer/${user?.id}/manage-requests`,
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
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    //   type: "link",
    //   isHandleNavigationLink: "pricing",
    // },
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

  return user?.role === "provider"
    ? PROVIDER_NAV_ITEMS
    : user?.role === "customer"
    ? CUSTOMER_NAV_ITEMS
    : PUBLIC_NAV_ITEMS;
};
