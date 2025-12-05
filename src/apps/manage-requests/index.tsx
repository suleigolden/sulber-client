import { Box } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { CustomerManageRequests } from "./CustomerManageRequests";
import { ProviderManageRequests } from "./ProviderManageRequests";



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
