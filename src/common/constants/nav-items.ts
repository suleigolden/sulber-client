import { User } from "@suleigolden/sulber-api-client";


export type NavItem = {
  label: string;
  children?: Array<NavItem>;
  href?: string;
  type: "button" | "link";
  isHandleNavigationLink?: string;
  /** When true, fetches and displays total unread count (e.g. for Messages) */
  showUnreadBadge?: boolean;
};

export const getNavItems = (user: User) => {
  const PROVIDER_NAV_ITEMS: Array<NavItem> = [
    {
      label: "Manage Jobs",
      href: `/provider/${user?.id}/dashboard`,
      type: "link",
    },
    {
      label: "Post a Job",
      href: `/provider/${user?.id}/post-a-job`,
      type: "link",
    },
    {
      label: "Payouts",
      href: `/provider/${user?.id}/payouts`,
      type: "link",
    },
    {
      label: "Messages",
      href: `/provider/${user?.id}/messages`,
      type: "link",
      showUnreadBadge: true,
    },
    {
      label: "Log Out",
      href: "/logout",
      type: "button",
    },
  ];
  const CUSTOMER_NAV_ITEMS: Array<NavItem> = [
    {
      label: "Requests a Service",
      href: `/customer/${user?.id}/dashboard`,
      type: "link",
    },
    {
      label: "Manage Requests",
      href: `/customer/${user?.id}/manage-requests`,
      type: "link",
    },
    {
      label: "Messages",
      href: `/customer/${user?.id}/messages`,
      type: "link",
      showUnreadBadge: true,
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
  const SYSTEM_ADMIN_NAV_ITEMS: Array<NavItem> = [
    {
      label: "Dashboard",
      href: `/system-admin/${user?.id}/system-admin-dashboard`,
      type: "link",
    },
    {
      label: "Manage Customers",
      href: `/system-admin/${user?.id}/manage-customers`,
      type: "link",
    },
    {
      label: "Manage Payouts",
      href: `/system-admin/${user?.id}/manage-payouts`,
      type: "link",
    },
    {
      label: "Manage Providers",
      href: `/system-admin/${user?.id}/manage-providers`,
      type: "link",
    },
    {
      label: "Log Out",
      href: "/logout",
      type: "button",
    },
  ];

  return user?.role === "provider"
    ? PROVIDER_NAV_ITEMS
    : user?.role === "customer"
    ? CUSTOMER_NAV_ITEMS
    : user?.role === "system-admin"
    ? SYSTEM_ADMIN_NAV_ITEMS
    : PUBLIC_NAV_ITEMS;
};
