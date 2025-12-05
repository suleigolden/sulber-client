import { Box } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { CustomerManageRequests } from "./customer/CustomerManageRequests";
import { ProviderManageRequests } from "./provider/ProviderManageRequests";



export const ManageRequests = () => {
    const {user} = useUser();

    switch(user.role){
        case "customer":
            return <CustomerManageRequests />;
        case "provider":
            return <ProviderManageRequests />;
        default:
            return <Box>Dashboard</Box>;
    }
};
