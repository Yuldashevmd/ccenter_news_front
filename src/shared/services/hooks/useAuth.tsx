import { getLocalStorageItem } from '../helpers/fns';

export const useAuth =()=>{
  const isAuth = getLocalStorageItem<boolean>('isAuth');

  return {
    isAuth,
  };
}
