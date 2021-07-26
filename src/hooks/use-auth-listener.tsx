// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import { firebase } from '../libs/firebase';
import { useAppDispatch } from '../store/hooks/hooks';
import { login, logout } from '../store/slices/userSlice';

const useAuthListener = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        dispatch(login(authUser));
      } else {
        localStorage.removeItem('authUser');
        dispatch(logout());
      }
    });

    return () => listener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);
};

export default useAuthListener;
