import { Alert, AlertIcon, Box, AlertTitle, AlertDescription,Text } from "@chakra-ui/react";
import { Renter } from "@suleigolden/co-renting-api-client";
import { FC } from "react";
import { useUser } from "~/hooks/use-user";


type IsBioCompletedProps = {
    renter: Renter;
}
export const IsBioCompleted: FC<IsBioCompletedProps> = ({renter}) => {
    const { user } = useUser();
    const isBioCompleted = !renter?.bio ||
    !renter?.my_work ||
    !renter?.my_interests;

    if(isBioCompleted){
        return (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Complete Your Profile</AlertTitle>
                <AlertDescription>
                  A complete profile increases your chances of being accepted.{" "}
                  <Text as={"a"} color="blue.500"  href={`/owner/${user.id}/profile-settings`}>
                    Update now
                  </Text>
                </AlertDescription>
              </Box>
            </Alert>
        )
    }
}