import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebase, FieldValue } from '../../../../libs/firebase';
import { selectLoggedInUserPhotos, updateLikesPhoto } from '../../../../store/slices/loggedInUserPhotosSlice';
import { selectLoggedInUser, updateLikes } from '../../../../store/slices/loggedInUserSlice';
import { selectUser } from '../../../../store/slices/userSlice';

interface PROPS {
  docId: string;
  totalLikes: number;
  likedPhoto: boolean;
  handleFocus: () => void;
}

const Actions: React.FC<PROPS> = ({ docId, totalLikes, likedPhoto, handleFocus }) => {
  const dispatch = useDispatch();
  const { uid: userId } = useSelector(selectUser);
  const loggedInUser = useSelector(selectLoggedInUser);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);

  useEffect(() => {
    setToggleLiked(likedPhoto);
  }, [likedPhoto]);

  const handleToggleLiked = async () => {
    setToggleLiked((prevtToggleLiked) => !prevtToggleLiked);

    await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        likes: toggleLiked ? FieldValue.arrayRemove(userId) : FieldValue.arrayUnion(userId),
      });

    setLikes((prevLikes) => (toggleLiked ? prevLikes - 1 : prevLikes + 1));

    await firebase
      .firestore()
      .collection('users')
      .doc(loggedInUser.docId)
      .update({
        likes: toggleLiked ? FieldValue.arrayRemove(docId) : FieldValue.arrayUnion(docId),
      });

    dispatch(updateLikes({ toggleLiked, docId }));
    if (loggedInUserPhotos.some((photo) => photo.docId === docId)) dispatch(updateLikesPhoto({ docId, userId, toggleLiked }));
  };

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex">
          <svg
            onClick={handleToggleLiked}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                handleToggleLiked().catch((err) => alert(err.message));
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 h-8 mr-4 select-none cursor-pointer focus:outline-none leading-none ${
              toggleLiked ? 'fill-red text-red-primary' : 'text-black-light'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFocus();
              }
            }}
            className="w-8 h-8 text-black-light select-none cursor-pointer leading-none focus:outline-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">{likes === 1 ? `${likes} like` : `${likes} likes`}</p>
      </div>
    </>
  );
};

export default Actions;
