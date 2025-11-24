import { User } from "@suleigolden/sulber-api-client";


export const homePageLink = (user: User) => {
    if(user.role === "provider") {
        return `/provider/${user.id}/dashboard`;
    }else if(user.role === "customer") {
        return `/customer/${user.id}/dashboard`;
    }else{
        return `/`;
    }
};
