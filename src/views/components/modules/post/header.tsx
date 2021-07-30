import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DEFAULT_IMAGE_PATH from '../../../../constants/paths';
import { responcePhotoDataWithUserInfo, responceUserData } from '../../../../models/responceData';
import { setIsModalOpen, setPhotoDetail } from '../../../../store/slices/photoDetaiModallSlice';
import { selectUser } from '../../../../store/slices/userSlice';
import backfaceFixed from '../../../../utils/backfaceFixed';

interface PROPS {
  content: responcePhotoDataWithUserInfo;
  postUser: responceUserData;
  isProfilePage: boolean;
}

const Header: React.FC<PROPS> = ({ content, postUser, isProfilePage }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser);
  const isPostUser = loggedInUser.displayName === content.username;

  const openPostEditModal = () => {
    dispatch(setPhotoDetail(content));
    backfaceFixed(true);
    dispatch(setIsModalOpen(true));
  };

  const openPostDetailModal = () => {
    dispatch(setPhotoDetail(content));
    backfaceFixed(true);
    dispatch(setIsModalOpen(true));
  };

  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center justify-between w-full">
        {isProfilePage ? null : (
          <Link to={`/p/${content.username}`} className="flex items-center">
            <img
              className="rounded-full h-8 w-8 flex mr-3"
              src={!postUser || !postUser?.bikeImageUrl ? DEFAULT_IMAGE_PATH : postUser.bikeImageUrl}
              alt={`${content.username} profile`}
            />
            <p className="font-bold">{content.username}</p>
          </Link>
        )}
        {isPostUser ? (
          <button
            className="flex items-center text-logoColor-base  outline-none rounded text-sm px-2 py-1 border border-gray-primary hover:opacity-70"
            type="button"
            onClick={openPostEditModal}
          >
            編集
            <div className="border-l border-gray-primary pl-2 ml-2 ">
              <img className="h-3 w-3 inline-block" src="/images/postEditIcon.png" alt="編集" />
            </div>
          </button>
        ) : (
          <button
            className="flex items-center text-logoColor-base  outline-none rounded text-sm px-2 py-1 border border-gray-primary hover:opacity-70"
            type="button"
            onClick={openPostDetailModal}
          >
            詳細
            <img className="h-4 w-4 inline-block ml-3 " src="/images/detail.png" alt="詳細を見る" />
          </button>
        )}
      </div>
    </div>
  );
};
export default Header;
