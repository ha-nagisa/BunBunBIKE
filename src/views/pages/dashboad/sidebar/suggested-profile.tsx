import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoggedInUserFollowing, updateFollowedUserFollowers, getUserByUserId } from '../../../../utils/firebase';
import DEFAULT_IMAGE_PATH from '../../../../constants/paths';
import { selectLoggedInUser, setActiveUser } from '../../../../store/slices/loggedInUserSlice';

interface PROPS {
  profileDocId: string;
  username: string;
  profileId: string;
  userId: string;
  loggedInUserDocId: string;
  profileImageUrl: string;
}

const SuggestedProfile: React.FC<PROPS> = ({ profileDocId, username, profileId, userId, loggedInUserDocId, profileImageUrl }) => {
  const dispatch = useDispatch();
  const activeUser = useSelector(selectLoggedInUser);
  const [loaded, setLoaded] = useState(false);
  const isFollowing = activeUser.following && activeUser.following !== undefined ? activeUser.following.some((uId) => uId === profileId) : false;

  async function handleFollowUser() {
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
    const [user] = await getUserByUserId(userId);
    dispatch(setActiveUser(user));
  }

  async function handleUnFollowUser() {
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, true);
    await updateFollowedUserFollowers(profileDocId, userId, true);
    const [user] = await getUserByUserId(userId);
    dispatch(setActiveUser(user));
  }

  return (
    <div className="flex flex-row items-center align-items justify-between">
      <div className="flex items-center justify-between">
        <img
          className="rounded-full w-8 h-8 object-cover flex mr-3"
          src={loaded ? profileImageUrl || DEFAULT_IMAGE_PATH : DEFAULT_IMAGE_PATH}
          alt={`${username} profile`}
          onLoad={() => setLoaded(true)}
        />
        <Link className="w-auto break-all" to={`/p/${username}`}>
          <p className="font-bold text-sm break-all">{username}</p>
        </Link>
      </div>
      {!isFollowing ? (
        <button
          className="rounded text-xs font-bold bg-white text-logoColor-base px-2 py-1 border border-logoColor-base hover:bg-logoColor-base hover:text-white"
          type="button"
          onClick={handleFollowUser}
        >
          Follow
        </button>
      ) : (
        <button
          className="rounded text-xs font-bold bg-white text-logoColor-base px-2 py-1 border border-logoColor-base hover:bg-logoColor-base hover:text-white"
          type="button"
          onClick={handleUnFollowUser}
        >
          Unfollow
        </button>
      )}
    </div>
  );
};

export default SuggestedProfile;
