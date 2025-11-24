import { Box, useDisclosure, Spinner } from "@chakra-ui/react";
import { User } from "@suleigolden/sulber-api-client";
import Footer from "../../components/footer/FooterAdmin";
import { AdminNavbar } from "../../components/navbar/NavbarAdmin";
import { useUser } from "~/hooks/use-user";
import { useState } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { navBarRoutes } from "../../routes";
import { Route, Routes } from "react-router-dom";
import { ProviderOnboarding } from "~/apps/provider-onboard";
import { UserProfileSettings } from "~/apps/users/UserProfileSettings";
import { Dashboard } from "~/apps/dashboard/Dashboard";

// Add type definition at the top
type RoutesType = {
  name: string;
  layout: string;
  path: string;
  component: React.ReactElement;
  icon: React.ReactElement;
  secondary?: boolean;
  isHidden?: boolean;
};

export const DashboardNavBar = (props: Record<string, unknown>) => {
  const { user } = useUser();

  if (!user) {
    // window.location.href = '/';
  }

  const navRoutes = navBarRoutes(user?.role, user as User);
  const { ...rest } = props;
  const [fixed] = useState<boolean>(false);
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const getActiveNavbar = (routes: RoutesType[]): boolean => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i]?.layout + routes[i]?.path) !== -1
      ) {
        return routes[i]?.secondary ?? false;
      }
    }
    return false;
  };
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    const activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i]?.layout + routes[i]?.path) !== -1
      ) {
        return routes[i]?.name;
      }
    }
    return activeNavbar;
  };

  const { onOpen } = useDisclosure();

  if (!user) {
    return <Spinner />;
  }
  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Box
          minHeight="100vh"
          height="100%"
          maxHeight="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
          borderBottom="5px solid #000"
        >
          <Box borderBottom="3px solid rgb(216, 90, 21)" width="100%">
            <AdminNavbar
              onOpen={onOpen}
              secondary={getActiveNavbar(navRoutes as unknown as RoutesType[])}
              message={getActiveNavbarText(
                navRoutes as unknown as RoutesType[],
              )}
              fixed={fixed}
              {...rest}
            />
          </Box>

          <Box
            mx="auto"
            p={{ base: "20px", md: "30px" }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            <Routes>
              <Route
                path={`/${user.id}/provider-onboarding`}
                element={<ProviderOnboarding />}
              />

              <Route path={`/${user.id}/dashboard`} element={<Dashboard />} />
              
              {/* User profile Settings */}
              <Route
                path={`/${user.id}/profile-settings`}
                element={<UserProfileSettings />}
              />

            </Routes>
          </Box>

          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
};
