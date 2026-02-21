import React from 'react';
import {Composition} from 'remotion';
import {WhatsappIADemo} from './WhatsappIADemo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="WhatsappIADemo"
        component={WhatsappIADemo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
