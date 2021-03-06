import React from 'react';
import { useDispatch } from 'react-redux';
import { setIsModalOpen } from '../../../store/slices/photoDetaiModallSlice';

const PostErrorModal: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="bg-white p-6 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-50vh w-4/5 z-30">
        <div>
          <h1>何らかのエラーが発生しました。ページを再度読み込んでいただきお試しいただけると幸いです。</h1>
        </div>
        <div>✕</div>
      </div>
      <button
        aria-label="閉じる"
        type="button"
        onClick={() => dispatch(setIsModalOpen(false))}
        className="bg-black-base opacity-70 cursor-pointer fixed top-0 left-0 h-full w-full"
      />
    </>
  );
};

export default PostErrorModal;
