import { Icon } from '@chakra-ui/react';
import {
  MdHome,
} from 'react-icons/md';
import { Role, User } from '@suleigolden/sulber-api-client';
import { Dashboard } from './apps/dashboard/Dashboard';


export const adminRoutes = (user: User) => [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: `/${user.id}/admin-dashboard`,
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },

];

export const customerRoutes = (user: User) => [
  {
    name: 'Dashboard',
    layout: '/customer',
    path: `/${user.id}/dashboard`,
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
];


export const providerRoutes = (user: User) => [
  {
    name: 'Dashboard',
    layout: '/provider',
    path: `/${user.id}/dashboard`,
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
 
];

export const navBarRoutes = (role: Role, user: User) => {
  
  switch (role) {
    case 'customer':
      return customerRoutes(user);
    case 'provider':
      return providerRoutes(user);
    default:
      break;
  }
};