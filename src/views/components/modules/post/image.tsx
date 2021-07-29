import React, { useState } from 'react';

interface PROPS {
  realSrc: string;
  title: string;
}

const Image: React.FC<PROPS> = ({ realSrc, title }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      className={`w-full ${loaded ? '' : 'animate-pulse'}`}
      src={loaded ? realSrc : '/images/postDummy.jpg'}
      alt={title}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default Image;
