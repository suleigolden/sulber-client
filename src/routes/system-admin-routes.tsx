import { User } from "@suleigolden/sulber-api-client";
import { Navigate, Route } from "react-router-dom";
import { SystemAdminDashboard } from "~/apps/system-admin/dashboard";
import { SystemAdminManageCustomers } from "~/apps/system-admin/manage-customers";
import { SystemAdminManagePayouts } from "~/apps/system-admin/manage-payouts";
import { SystemAdminManageProviders } from "~/apps/system-admin/manage-providers";
import { useUser } from "~/hooks/use-user";


const SystemAdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (!user || user.role !== "system-admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const superSystemAdminAuthRoutes = (user: User) => {
  return (
    <>
      <Route
        path={`/${user.id}/system-admin-dashboard`}
        element={
          <SystemAdminGuard>
            <SystemAdminDashboard />
          </SystemAdminGuard>
        }
      />
      <Route
        path={`/${user.id}/manage-customers`}
        element={
          <SystemAdminGuard>
            <SystemAdminManageCustomers />
          </SystemAdminGuard>
        }
      />
      <Route
        path={`/${user.id}/manage-payouts`}
        element={
          <SystemAdminGuard>
            <SystemAdminManagePayouts />
          </SystemAdminGuard>
        }
      />
      <Route
        path={`/${user.id}/manage-providers`}
        element={
          <SystemAdminGuard>
            <SystemAdminManageProviders />
          </SystemAdminGuard>
        }
      />
    </>
  );
};

