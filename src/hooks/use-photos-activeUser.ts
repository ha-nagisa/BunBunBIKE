import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutLoggedInUserPhotos, setLoggedInUserPhotos } from '../store/slices/loggedInUserPhotosSlice';
import { getUserPhotosByUserId } from '../utils/firebase';

const useActiveUserPhotos = (userId: string): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserPhotosAll() {
      const Photos = await getUserPhotosByUserId(userId);
      if (Photos) {
        Photos.sort((a, b) => b.dateCreated - a.dateCreated);
      }
      dispatch(setLoggedInUserPhotos(Photos));
    }
    if (userId) {
      // eslint-disable-next-line no-void
      void getUserPhotosAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};

export default useActiveUserPhotos;
