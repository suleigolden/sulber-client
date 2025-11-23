import { useNavigate } from "react-router-dom";
import { logout } from "~/redux-action/slices/auth-slice";
import { AppDispatch } from "~/redux-action/store";
import { useDispatch } from "react-redux";


export const useSignOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    return async () => {
      await dispatch(logout());
      setTimeout(() => {
        navigate("/");
      }, 1000);
    };
  };
  