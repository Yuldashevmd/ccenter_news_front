import { getLocalStorageItem } from '../helpers/fns';

export const useAuth =()=>{
  const isAuth = getLocalStorageItem<boolean>('isAuth');
  const user = getLocalStorageItem<{ email: string; password: string }>('user');

  return {
    isAuth,
    user,
  };
}
