import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { responcePhotoDataWithUserInfo, responceUserData } from '../models/responceData';
import { selectLoggedInUserPhotos } from '../store/slices/loggedInUserPhotosSlice';
import { getPhotosFavorite } from '../utils/firebase';

interface RETURNVALUE {
  photos: responcePhotoDataWithUserInfo[] | null;
}

const usePhotosFavorite = (user: responceUserData): RETURNVALUE => {
  const [photos, setPhotos] = useState<responcePhotoDataWithUserInfo[] | null>(null);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);

  useEffect(() => {
    async function getTimelinePhotosFavorite() {
      if (user?.likes?.length > 0) {
        const favoritedPhotos = await getPhotosFavorite(user?.userId, user.likes);

        if (loggedInUserPhotos) {
          const favoritedPhotoInUserPhotos = favoritedPhotos.map((favaritedphoto) => {
            const copyLoggedInUserPhotos = [...loggedInUserPhotos];
            if (copyLoggedInUserPhotos && copyLoggedInUserPhotos.some((userPhoto) => userPhoto.docId === favaritedphoto.docId)) {
              return copyLoggedInUserPhotos.filter((userPhoto) => userPhoto.docId === favaritedphoto.docId)[0];
            }
            return favaritedphoto;
          });

          favoritedPhotoInUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
          setPhotos(favoritedPhotoInUserPhotos);
          return;
        }
        favoritedPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(favoritedPhotos);
      } else {
        setPhotos([]);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    getTimelinePhotosFavorite().catch((err) => alert(err.message));
  }, [user?.userId, loggedInUserPhotos, user?.likes]);

  return { photos };
};

export default usePhotosFavorite;
