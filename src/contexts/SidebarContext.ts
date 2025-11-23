import { createContext } from 'react';

type SidebarContextType = {
  toggleSidebar: boolean;
  setToggleSidebar: (value: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  toggleSidebar: false,
  setToggleSidebar: () => {},
});
