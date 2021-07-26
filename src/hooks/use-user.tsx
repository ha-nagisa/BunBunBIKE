import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setActiveUser } from '../store/slices/loggedInUserSlice';
import { getUserByUserId } from '../utils/firebase';

const useUser = (userId: string): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    // eslint-disable-next-line no-shadow
    async function getUserObjByUserId(userId: string) {
      const [user] = await getUserByUserId(userId);
      dispatch(setActiveUser(user));
    }

    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getUserObjByUserId(userId);
    }
  }, [dispatch, userId]);
};

export default useUser;
