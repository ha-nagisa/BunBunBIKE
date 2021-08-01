/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserByUsername } from '../../../utils/firebase';
import * as ROUTES from '../../../constants/routes';
import Header from '../../components/block/header';
import ProfileMain from './profileMain';
import PostIcon from '../../components/atoms/postIcon';
import FollowedUserModal from './followedUserModal';
import FollowingUserModal from './followingUserModal';
import PostEditModal from '../../components/modules/postEditModal';
import PostDetailModal from '../../components/modules/postDetailModal';
import { selectIsModalOpen } from '../../../store/slices/photoDetaiModallSlice';
import { selectLoggedInUser } from '../../../store/slices/loggedInUserSlice';
import { responceUserData } from '../../../models/responceData';

const Profile: React.FC = () => {
  const history = useHistory();
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<responceUserData | null>(null);
  const [isOpenFollowingModal, setIsOpenFollowingModal] = useState(false);
  const [isOpenFollowedModal, setIsOpenFollowedModal] = useState(false);
  const isModalOpen = useSelector(selectIsModalOpen);
  const activeUser = useSelector(selectLoggedInUser);
  const isPostUser = username === activeUser?.username;

  useEffect(() => {
    document.title = 'Profile | Bun Bun BIKE';
  }, []);

  useEffect(() => {
    async function checkUserExists() {
      const [userData] = await getUserByUsername(username);
      if (userData && userData?.userId && isPostUser) {
        setUser(activeUser);
      } else if (userData && userData?.userId) {
        setUser(userData);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists().catch((err) => alert((err as Error).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, history]);

  return user?.username ? (
    <div className="bg-gray-background relative">
      <Header />
      <div className="mx-auto max-w-screen-xl pb-5">
        <ProfileMain
          user={user}
          setUser={setUser}
          setIsOpenFollowingModal={setIsOpenFollowingModal}
          setIsOpenFollowedModal={setIsOpenFollowedModal}
        />
      </div>
      {isOpenFollowingModal ? <FollowingUserModal user={user} setIsOpenFollowingModal={setIsOpenFollowingModal} /> : null}
      {isOpenFollowedModal ? <FollowedUserModal user={user} setIsOpenFollowedModal={setIsOpenFollowedModal} /> : null}
      {isModalOpen ? isPostUser ? <PostEditModal /> : <PostDetailModal /> : null}
      <PostIcon />
    </div>
  ) : null;
};

export default Profile;
