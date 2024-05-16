'use client';
import useBgmStore from '@/app/_store/useBgmStore';
import React, { useEffect, useRef } from 'react';

export default function BgmComponent() {
  const { bgm, isPlaying } = useBgmStore();
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioElement.current?.play();
    } else {
      audioElement.current?.pause();
    }
  }, [isPlaying]);

  return <audio src={bgm} autoPlay ref={audioElement} />;
}
