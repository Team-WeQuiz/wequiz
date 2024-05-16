'use client';
import useBgmStore from '@/app/_store/useBgmStore';
import React, { useEffect } from 'react';

export default function BgmComponent() {
  const { bgm, isPlaying } = useBgmStore();

  return <audio src={bgm} autoPlay={true} loop={true} muted={!isPlaying} />;
}
