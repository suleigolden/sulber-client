import { Box } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { CustomerMessages } from "./customer";
import { ProviderMessages } from "./provider";


export const Messages = () => {
    const {user} = useUser();

    switch(user.role){
        case "customer":
            return <CustomerMessages />;
        case "provider":
            return <ProviderMessages />;
        default:
            return <Box>No messages found</Box>;
    }
};