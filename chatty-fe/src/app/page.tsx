'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const navigate = useRouter();
  useEffect(() => {
    navigate.push('/main');
  }, []);
  return <div></div>;
}
