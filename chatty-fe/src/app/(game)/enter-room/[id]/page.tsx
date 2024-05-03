'use client';

import { useRouter } from 'next/navigation';
import MainLobby from '../../main-lobby/page';
import EnteringModals from './_component/EnteringModals/EnteringModals';

const EnterRoomPage = ({
  params: { id: roomId },
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  return (
    <>
      <MainLobby />
      <EnteringModals
        id={roomId}
        goingBack={() => router.push('/main-lobby')}
      />
    </>
  );
};

export default EnterRoomPage;
