import React, { useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { responcePhotoDataWithUserInfo, responceUserData } from '../../../../models/responceData';
import { selectLoggedInUserPhotos } from '../../../../store/slices/loggedInUserPhotosSlice';
import { selectLoggedInUser } from '../../../../store/slices/loggedInUserSlice';
import { getUserPhotosByUserId } from '../../../../utils/firebase';
import ProfileHeader from './profileHeader';
import ProfilePhotos from './profilePhotos';

interface PROPS {
  user: responceUserData;
  setIsOpenFollowingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenFollowedModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StateType {
  profile: responceUserData;
  photosCollection: responcePhotoDataWithUserInfo[] | null;
  followerCount: number;
}
interface ActionType {
  profile?: responceUserData;
  photosCollection?: responcePhotoDataWithUserInfo[] | null;
  followerCount: number;
}
const ProfileMain: React.FC<PROPS> = ({ user, setIsOpenFollowingModal, setIsOpenFollowedModal }) => {
  const activeUser = useSelector(selectLoggedInUser);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const reducer = (state: StateType, newState: ActionType) => ({ ...state, ...newState });
  const initialState = {
    profile: {} as responceUserData,
    photosCollection: null,
    followerCount: 0,
  };

  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      let photos = await getUserPhotosByUserId(user.userId);
      photos.sort((a, b) => b.dateCreated - a.dateCreated);
      if (activeUser?.userId === user?.userId) {
        photos = !loggedInUserPhotos ? photos : loggedInUserPhotos;
      }
      dispatch({ profile: user, photosCollection: photos, followerCount: user.followers.length });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    getProfileInfoAndPhotos().catch((err) => alert(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username, loggedInUserPhotos]);

  return (
    <>
      <ProfileHeader
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
        setIsOpenFollowingModal={setIsOpenFollowingModal}
        setIsOpenFollowedModal={setIsOpenFollowedModal}
      />
      <ProfilePhotos photos={photosCollection} />
    </>
  );
};

export default ProfileMain;
