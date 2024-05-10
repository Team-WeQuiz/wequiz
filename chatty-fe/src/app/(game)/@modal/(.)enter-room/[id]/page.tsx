'use client';

import EnteringModals from '@/app/(game)/enter-room/[id]/_component/EnteringModals/EnteringModals';
import { useRouter, useSearchParams } from 'next/navigation';


const EnterRoomModal = ({
  params: { id: roomId },
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const creation = Boolean(searchParams.get('create')) || false;


  const handleBack = () => {
    if (creation) return;
    router.back();
  };
  return <EnteringModals id={roomId} goingBack={handleBack} />;
};

export default EnterRoomModal;
