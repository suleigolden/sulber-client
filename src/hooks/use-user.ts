import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '~/redux-action/slices/auth-slice';

export const useUser = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  return { user, token };
};
