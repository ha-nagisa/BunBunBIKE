import React, { useEffect } from 'react';
import Header from '../../components/block/header';

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = 'Not Found - Bun Bun BIKE';
  }, []);
  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg mt-20">
        <p className="text-center text-xl">該当のページが見つかりません。</p>
      </div>
    </div>
  );
};

export default NotFound;
