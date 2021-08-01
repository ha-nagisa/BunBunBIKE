import React, { useEffect } from 'react';
import Header from '../../components/block/header';
import PostPhoto from './postPhoto';

const Post: React.FC = () => {
  useEffect(() => {
    document.title = 'Post | Bun Bun BIKE';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <PostPhoto />
    </div>
  );
};

export default Post;
