/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { isUserFollowingProfile, toggleFollow } from '../../../../utils/firebase';
import backfaceFixed from '../../../../utils/backfaceFixed';
import DEFAULT_IMAGE_PATH from '../../../../constants/paths';
import { responcePhotoDataWithUserInfo, responceUserData } from '../../../../models/responceData';
import { selectLoggedInUser, updateFollowing } from '../../../../store/slices/loggedInUserSlice';

interface ActionType {
  profile?: responceUserData;
  photosCollection?: responcePhotoDataWithUserInfo[] | null;
  followerCount: number;
}

interface PROPS {
  photosCount: number;
  followerCount: number;
  setFollowerCount: React.Dispatch<ActionType>;
  setIsOpenFollowingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenFollowedModal: React.Dispatch<React.SetStateAction<boolean>>;
  profile: responceUserData;
}

const ProfileHeader: React.FC<PROPS> = ({
  photosCount,
  followerCount,
  setFollowerCount,
  setIsOpenFollowingModal,
  setIsOpenFollowedModal,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    bikeImageUrl: profileBikeImageUrl,
    carModel,
    maker,
    followers,
    following,
    username: profileUsername,
  },
}) => {
  const dispatch = useDispatch();
  const activeUser = useSelector(selectLoggedInUser);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = activeUser?.username && activeUser?.username !== profileUsername;

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(activeUser.username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (activeUser?.username && profileUserId) {
      isLoggedInUserFollowingProfile().catch((err) => alert((err as Error).message));
    }
  }, [activeUser?.username, profileUserId, profileUsername]);

  const handleToggleFollow = async () => {
    if (activeUser.docId && profileDocId) {
      setIsFollowingProfile((PrevisFollowingProfile) => !PrevisFollowingProfile);
      setFollowerCount({
        followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
      });
      await toggleFollow(isFollowingProfile, activeUser.docId, profileDocId, profileUserId, activeUser.userId);

      dispatch(updateFollowing({ isFollowingProfile, profileUserId }));
    }
  };

  const openFollowedModal = () => {
    backfaceFixed(true);
    setIsOpenFollowedModal(true);
  };

  const openFollowingModal = () => {
    backfaceFixed(true);
    setIsOpenFollowingModal(true);
  };

  return (
    <div className="block sm:flex sm:justify-center mx-auto max-w-screen-lg">
      <div className="flex justify-center items-center sm:pr-20">
        <div className="text-center">
          <img
            className="inline object-cover w-40 h-40 mr-2 rounded-full"
            alt={`${carModel} profile picture`}
            src={!profileBikeImageUrl ? DEFAULT_IMAGE_PATH : profileBikeImageUrl}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE_PATH;
            }}
          />
          <div className="container mt-3">
            <p className="text-xl font-medium text-center">
              {activeBtnFollow && isFollowingProfile === null ? (
                <Skeleton count={1} width={100} height={32} />
              ) : activeBtnFollow ? (
                <button
                  className="border border-logoColor-base bg-logoColor-base font-bold text-sm rounded text-white w-full h-8 mb-2 hover:bg-white hover:text-logoColor-base focus:outline-none"
                  type="button"
                  onClick={handleToggleFollow}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleToggleFollow().catch((err) => alert((err as Error).message));
                    }
                  }}
                >
                  {isFollowingProfile ? 'Unfollow' : 'Follow'}
                </button>
              ) : (
                <Link
                  to={`/p/${profileUsername}/edit`}
                  className="block border border-gray-500 bg-white font-bold text-sm rounded text-gray-500 w-full px-2 py-1 sm:mb-2 mb-0 hover:opacity-70 focus:outline-none"
                >
                  プロフィールの編集
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col text-center mt-2 sm:mt-0 sm:text-left">
        <div className="container">
          <p className="text-2xl mr-4 leading-none">
            <span className="text-xs leading-none block">ユーザーネーム</span>
            {!profileUsername ? <Skeleton count={1} height={24} width={100} /> : profileUsername}
          </p>
          <p className="text-2xl mr-4 leading-none mt-3">
            <span className="text-xs leading-none block mb-1">バイク</span>
            {!maker ? <Skeleton count={1} height={24} width={100} /> : maker}
            {'　'}
            {!carModel ? <Skeleton count={1} height={24} width={100} /> : carModel}
          </p>
        </div>
        <div className="container flex mt-6 justify-center sm:justify-start">
          {!followers || !following ? (
            <Skeleton count={1} width={300} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold text-lg">{photosCount}</span> posts
              </p>
              <button onClick={openFollowedModal} type="button" className="mr-10 block focus:outline-none">
                <span className="font-bold text-lg">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </button>
              <button onClick={openFollowingModal} type="button" className="block focus:outline-none">
                <span className="font-bold text-lg">{following?.length}</span> following
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
