'use client';
import useBgm from '@/app/_hooks/useBgm';
import useBgmStore from '@/app/_store/useBgmStore';
import React, { useEffect, useRef } from 'react';

export default function BgmComponent() {
  const { bgm, isPlaying } = useBgmStore();
  const { checkUrlAndChangeBgm, url } = useBgm();
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioElement.current?.play();
    } else {
      audioElement.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    checkUrlAndChangeBgm();
  }, [url]);

  return <audio src={bgm} autoPlay loop ref={audioElement} />;
}
