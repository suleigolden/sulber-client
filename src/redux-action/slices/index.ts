import { AnyAction, Reducer, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

const rootReducer = combineReducers({
  auth: authReducer
});

export const resetAllReducers = () => ({
  type: "RESET_ALL_REDUCERS",
});

const rootReducerWithReset: Reducer<any, AnyAction> = (state: any, action: AnyAction) => {
    if (action.type === "RESET_ALL_REDUCERS") {
      state = undefined;
    }
    return rootReducer(state, action);
  };

export default rootReducerWithReset;
