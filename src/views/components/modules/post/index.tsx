import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

import { getUserByUsername } from '../../../../utils/firebase';
import { responcePhotoDataWithUserInfo, responceUserData } from '../../../../models/responceData';

interface PROPS {
  content: responcePhotoDataWithUserInfo;
}

const POST: React.FC<PROPS> = ({ content }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes('/p/');
  const [postUser, setPostUser] = useState<responceUserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getUserByUsername(content.username);
      setPostUser(user[0]);
    };

    if (content.username) getUser().catch((err) => alert((err as Error).message));
  }, [content.username]);

  const commentInput = useRef<HTMLInputElement>(null);
  const handleFocus = () => (commentInput.current as HTMLInputElement).focus();

  return (
    <div className={`${isProfilePage ? 'group' : 'col-span-4 sm:col-span-2'}  sm;mb-12 mb-8`}>
      <div className="rounded border bg-white border-gray-primary">
        {postUser ? <Header content={content} postUser={postUser} isProfilePage={isProfilePage} /> : null}
        <Image realSrc={content.imageSrc} title={content.title} />
        <Footer title={content.title} category={content.category} />
        <Actions docId={content.docId as string} totalLikes={content.likes.length} likedPhoto={content.userLikedPhoto} handleFocus={handleFocus} />
        <Comments docId={content.docId as string} comments={content.comments} posted={content.dateCreated} commentInput={commentInput} />
      </div>
    </div>
  );
};

export default POST;
