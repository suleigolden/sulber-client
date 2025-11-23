import { User } from "@suleigolden/co-renting-api-client";


export const homePageLink = (user: User) => {
    if(user.role === "landlord") {
        return `/owner/${user.id}/dashboard`;
    }else if(user.role === "renter") {
        return `/renter/${user.id}/dashboard`;
    }else{
        return `/`;
    }
};
