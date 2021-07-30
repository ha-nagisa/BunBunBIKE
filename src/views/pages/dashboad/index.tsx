/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../../store/slices/loggedInUserSlice';
import { selectIsModalOpen, selectPhotoDetaile } from '../../../store/slices/photoDetaiModallSlice';
import { setSuggestionProfile } from '../../../store/slices/suggestionProfilesSlice';
import { getSuggestedProfiles } from '../../../utils/firebase';
import PostIcon from '../../components/atoms/postIcon';
import Header from '../../components/block/header';
import PostDetailModal from '../../components/modules/postDetailModal';
import PostEditModal from '../../components/modules/postEditModal';
import PostErrorModal from '../../components/modules/postErrorModal';
import MobileSidebar from './mobileSidebar';
import Sidebar from './sidebar';
import TimeLineAll from './timeLineAll';
import TimelineFavorite from './timeLineFavorite';
import TimelineFollowing from './timelineFollowing';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [postConditional, setPostConditional] = useState('all');
  const activeUser = useSelector(selectLoggedInUser);
  const modalInfo = useSelector(selectPhotoDetaile);
  const isModalOpen = useSelector(selectIsModalOpen);
  const isPostUser = modalInfo?.username === activeUser?.username;

  useEffect(() => {
    document.title = 'Bun Bun Bike';
  }, []);

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(activeUser.userId, activeUser.following, activeUser.maker);
      dispatch(setSuggestionProfile(response));
    }

    if (activeUser && activeUser?.userId) {
      suggestedProfiles().catch((err) => alert((err as Error).message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser?.userId, activeUser?.following, activeUser?.maker]);

  return (
    <div className="bg-gray-background  relative">
      <Header />
      <div className="grid lg:grid-cols-5 grid-cols-4 gap-4 justify-between items-start mx-auto max-w-screen-xl grid-rows-280px px-5">
        <div className="col-span-4 grid-cols-4 grid gap-2">
          <div className="col-span-4 flex items-center mb-3">
            <div className="w-1/3">
              <button
                onClick={() => setPostConditional('all')}
                className={`text-center w-full border-b pb-2 focus:outline-none  shadow-borderBottom ${
                  postConditional === 'all' ? 'text-logoColor-base border-logoColor-base' : 'text-gray-400'
                }`}
                type="button"
              >
                みんなの投稿
              </button>
            </div>
            <div className="w-1/3">
              <button
                onClick={() => setPostConditional('follow')}
                className={`text-center w-full border-b pb-2 focus:outline-none shadow-borderBottom ${
                  postConditional === 'follow' ? 'text-logoColor-base border-logoColor-base' : 'text-gray-400'
                }`}
                type="button"
              >
                フォロー中
              </button>
            </div>
            <div className="w-1/3">
              <button
                onClick={() => setPostConditional('favorite')}
                className={`text-center w-full border-b pb-2 focus:outline-none shadow-borderBottom ${
                  postConditional === 'favorite' ? 'text-logoColor-base border-logoColor-base' : 'text-gray-400'
                }`}
                type="button"
              >
                お気に入り
              </button>
            </div>
          </div>
          <MobileSidebar />
          {postConditional === 'all' ? (
            <TimeLineAll />
          ) : postConditional === 'follow' ? (
            <TimelineFollowing />
          ) : postConditional === 'favorite' ? (
            <TimelineFavorite />
          ) : null}
        </div>
        <Sidebar />
      </div>
      <PostIcon />
      {isModalOpen ? modalInfo ? isPostUser ? <PostEditModal /> : <PostDetailModal /> : <PostErrorModal /> : null}
    </div>
  );
};
export default Dashboard;
