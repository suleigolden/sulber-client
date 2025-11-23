import { Box } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { CustomerDashboard } from "./CustomerDashboard";
import { ProviderDashboard } from "./ProviderDashboard";



export const Dashboard = () => {
    const {user} = useUser();

    switch(user.role){
        case "customer":
            return <CustomerDashboard />;
        case "provider":
            return <ProviderDashboard />;
        default:
            return <Box>Dashboard</Box>;
    }
};
