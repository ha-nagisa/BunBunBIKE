import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { firebase, FieldValue } from '../../../../libs/firebase';
import { COMMENT } from '../../../../models/responceData';
import { selectLoggedInUserPhotos, updateCommentsPhoto } from '../../../../store/slices/loggedInUserPhotosSlice';
import { selectUser } from '../../../../store/slices/userSlice';

interface PROPS {
  docId: string;
  comments: COMMENT[];
  setComments: React.Dispatch<React.SetStateAction<COMMENT[]>>;
  commentInput: React.RefObject<HTMLInputElement>;
}

const AddComment: React.FC<PROPS> = ({ docId, comments, setComments, commentInput }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const user = useSelector(selectUser);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const displayName = user.displayName ? user.displayName : 'NoUserName';

  const handleSubmitComment = (event: React.FormEvent) => {
    event.preventDefault();

    setComments([...comments, { displayName, comment }]);
    setComment('');

    if (loggedInUserPhotos.some((photo) => photo.docId === docId)) {
      dispatch(updateCommentsPhoto({ docId, displayName, comment }));
    }

    return firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({ displayName, comment }),
      });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0"
        method="POST"
        onSubmit={(event) => (comment.length >= 1 ? handleSubmitComment(event) : event.preventDefault())}
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full sm:py-5 sm:px-4 py-4 px-3 focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base"
          type="text"
          name="add-comment"
          placeholder="コメントを入力"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`px-5 text-sm font-bold text-logoColor-base focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base ${
            !comment ? 'opacity-25' : ''
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
