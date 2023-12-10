'use client';
import React, { useEffect, useState } from 'react';

const FadeInTransition = ({ children }: { children: React.ReactNode }) => {
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          transition: 'opacity 1s ease-in-out',
          opacity: fadeIn ? 1 : 0,
          display: fadeIn ? 'block' : 'none',
          zIndex: 9999,
        }}
      />
      {children}
    </>
  );
};

export default FadeInTransition;
