/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';
import firebaseApp from 'firebase';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import usePhotosAll from '../../../hooks/use-photos-all';
import { selectLoggedInUserPhotos } from '../../../store/slices/loggedInUserPhotosSlice';
import { selectLoggedInUser } from '../../../store/slices/loggedInUserSlice';
import { getPhotosAll } from '../../../utils/firebase';
import POST from '../../components/modules/post';

const TimeLineAll: React.FC = () => {
  const user = useSelector(selectLoggedInUser);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const { photos, setPhotos, latestDoc, setLatestDoc } = usePhotosAll(user);
  const [isLoading, setIsLoading] = useState(false);
  const isDisplayMoreRead = photos ? photos.length > 5 : false;
  const isReachingEnd = latestDoc === undefined;

  const addNextPhoto = async (doc: firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | null | undefined) => {
    setIsLoading(true);
    if (latestDoc && doc) {
      const { photosWithUserDetails: nextPhotos, lastDoc } = await getPhotosAll(user?.userId, doc);
      setLatestDoc(lastDoc);
      if (loggedInUserPhotos) {
        const nextPhotosInUserPhotos = nextPhotos.map((nextPhoto) => {
          const copyLoggedInUserPhotos = [...loggedInUserPhotos];
          if (copyLoggedInUserPhotos.length > 0 && copyLoggedInUserPhotos.some((userPhoto) => userPhoto.docId === nextPhoto.docId)) {
            return copyLoggedInUserPhotos.filter((userPhoto) => userPhoto.docId === nextPhoto.docId)[0];
          }
          return nextPhoto;
        });
        nextPhotosInUserPhotos.sort((a, b) => (a.dateCreated > b.dateCreated ? -1 : 1));
        setPhotos((prevPhotos) => {
          if (prevPhotos) return [...prevPhotos, ...nextPhotosInUserPhotos];
          return [...nextPhotosInUserPhotos];
        });
        setIsLoading(false);
        return;
      }
      nextPhotos.sort((a, b) => (a.dateCreated > b.dateCreated ? -1 : 1));
      setPhotos((prevPhotos) => {
        if (prevPhotos) return [...prevPhotos, ...nextPhotos];
        return [...nextPhotos];
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const updateLoggedInUserPhotos = () => {
      setPhotos((prevPhotos) => {
        if (prevPhotos) {
          return prevPhotos.map((photo) => {
            if (loggedInUserPhotos.some((lphoto) => lphoto.docId === photo.docId)) {
              return loggedInUserPhotos.filter((lphoto) => lphoto.docId === photo.docId)[0];
            }
            return photo;
          });
        }
        return prevPhotos;
      });
    };

    if (loggedInUserPhotos && loggedInUserPhotos.length > 0) {
      updateLoggedInUserPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUserPhotos]);

  return (
    <>
      {!photos ? (
        <>
          <div className="sm:col-span-2 col-span-4">
            <Skeleton count={4} height={400} className="mb-5" />
          </div>
          <div className="sm:col-span-2 col-span-4">
            <Skeleton count={4} height={400} className="mb-5" />
          </div>
        </>
      ) : (
        <>
          {photos.map((content) => (
            <POST key={content.docId} content={content} />
          ))}
          {isDisplayMoreRead ? (
            <div className="col-span-4 text-center pb-10  pt-0 sm:pt-5">
              <button
                onClick={() => addNextPhoto(latestDoc)}
                type="button"
                className={`font-bold border text-gray-700 border-gray-700 px-3 py-2 rounded-md ${
                  isLoading || isReachingEnd
                    ? 'opacity-50 cursor-default'
                    : 'hover:text-white hover:bg-gray-700 focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base'
                } `}
                disabled={isLoading || isReachingEnd}
              >
                {isLoading ? '???????????????...' : isReachingEnd ? '???????????????????????????' : '???????????????'}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default TimeLineAll;
