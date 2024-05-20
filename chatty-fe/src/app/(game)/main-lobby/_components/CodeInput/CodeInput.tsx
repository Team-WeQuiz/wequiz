'use client';

import { useState } from 'react';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { findByCode } from '@/app/_api/quiz';
import useAuthStore from '@/app/_store/useAuthStore';

const CodeInput = () => {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const enterRoomWithCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) return alert('코드를 입력해주세요');

    console.log('code', code);
    if (code || accessToken) {
      try {
        const res = (await findByCode(code, accessToken)) as any;
        router.push(`/enter-room/${res.roomId}`);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <form onSubmit={enterRoomWithCode}>
        <TextInputField
          value={code}
          placeholder="코드로 입장하기"
          borderRadius={12}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          inputmode="numeric"
          endAdornment={
            <SolidButton shadowExist={false} type="submit">
              <Image
                src="/images/log-in.svg"
                alt="enter-room"
                width={24}
                height={24}
              />
            </SolidButton>
          }
        />
      </form>
    </>
  );
};

export default CodeInput;
