import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import firebaseApp from 'firebase';
import { responcePhotoDataWithUserInfo, responceUserData } from '../models/responceData';
import { getPhotosAll } from '../utils/firebase';
import { selectLoggedInUserPhotos } from '../store/slices/loggedInUserPhotosSlice';

interface RETURNVALUE {
  photos: responcePhotoDataWithUserInfo[] | null;
  setPhotos: React.Dispatch<React.SetStateAction<responcePhotoDataWithUserInfo[] | null>>;
  latestDoc: firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | null | undefined;
  setLatestDoc: React.Dispatch<
    React.SetStateAction<firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | null | undefined>
  >;
}

const usePhotosAll = (user: responceUserData): RETURNVALUE => {
  const [photos, setPhotos] = useState<responcePhotoDataWithUserInfo[] | null>(null);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const [latestDoc, setLatestDoc] = useState<firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | null | undefined>(
    null
  );

  useEffect(() => {
    async function getTimelinePhotosAll() {
      const { photosWithUserDetails: allPhotos, lastDoc } = await getPhotosAll(
        user?.userId,
        latestDoc as firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | null
      );

      if (lastDoc !== undefined) setLatestDoc(lastDoc);

      if (loggedInUserPhotos) {
        const allPhotosInUserPhotos = allPhotos.map((allphoto) => {
          const copyLoggedInUserPhotos = [...loggedInUserPhotos];
          if (copyLoggedInUserPhotos.length > 0 && copyLoggedInUserPhotos.some((userPhoto) => userPhoto.docId === allphoto.docId)) {
            return copyLoggedInUserPhotos.filter((userPhoto) => userPhoto.docId === allphoto.docId)[0];
          }
          return allphoto;
        });
        allPhotosInUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(allPhotosInUserPhotos);
        return;
      }

      allPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setPhotos(allPhotos);
    }
    if (latestDoc === null && latestDoc !== undefined) {
      getTimelinePhotosAll().catch((err) => alert((err as Error).message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, loggedInUserPhotos]);

  return { photos, setPhotos, latestDoc, setLatestDoc };
};

export default usePhotosAll;
