'use client';

import EnteringModals from '@/app/(game)/enter-room/[id]/_component/EnteringModals/EnteringModals';
import { useRouter } from 'next/navigation';

const EnterRoomModal = ({
  params: { id: roomId },
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  return <EnteringModals id={roomId} goingBack={() => router.back()} />;
};

export default EnterRoomModal;
