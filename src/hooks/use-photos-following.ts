import { useState, useEffect } from 'react';
import { responcePhotoDataWithUserInfo, responceUserData } from '../models/responceData';
import { getPhotosFollwoing } from '../utils/firebase';

interface RETURNVALUE {
  photos: responcePhotoDataWithUserInfo[] | null;
}

const usePhotosFollowing = (user: responceUserData): RETURNVALUE => {
  const [photos, setPhotos] = useState<responcePhotoDataWithUserInfo[] | null>(null);

  useEffect(() => {
    async function getTimelinePhotosFollowing() {
      // フォローしているユーザーはいるか

      if (user && user?.following?.length > 0) {
        const followedUserPhotos = await getPhotosFollwoing(user.userId, user.following);
        if (followedUserPhotos) {
          // 日付順に並び替える
          followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
          setPhotos(followedUserPhotos);
        } else {
          setPhotos([]);
        }
      } else {
        setPhotos([]);
      }
    }

    getTimelinePhotosFollowing().catch((err) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      alert(err.message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, user?.following]);

  return { photos };
};

export default usePhotosFollowing;
