import React from 'react';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {adminRoutes} from 'routes';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { SidebarContext } from 'contexts/SidebarContext';
import { User } from '@suleigolden/co-renting-api-client';

// Add type for routes
type RoutesType = {
  name: string;
  layout: string;
  path: string;
  icon: React.ReactElement;
  component: React.ReactElement;
};

export default function Auth() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const getRoute = () => {
    return window.location.pathname !== '/auth/full-screen-maps';
  };
  const getRoutes = (routes: (user: User) => RoutesType[]) => {
    // Call the routes function with undefined or get the user from context
    const routesArray = routes(undefined);
    return routesArray.map((route: RoutesType, key: number) => {
      if (route.layout === '/auth') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      return null;
    });
  };
  const authBg = useColorModeValue('white', 'navy.900');
  document.documentElement.dir = 'ltr';
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Box
          bg={authBg}
          float="right"
          minHeight="100vh"
          height="100%"
          position="relative"
          w="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {getRoute() ? (
            <Box mx="auto" minH="100vh">
              <Routes>
                {getRoutes(adminRoutes)}
                <Route
                  path="/"
                  element={<Navigate to="/auth/sign-in" replace />}
                />
              </Routes>
            </Box>
          ) : null}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
