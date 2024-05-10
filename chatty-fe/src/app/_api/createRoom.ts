'use client';
import client from './client';
import useAuthStore from '@/app/_store/useAuthStore';
// import fs from 'fs';
// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable from 'formidable';
// import FormData from 'form-data';

export const postRoom = async (
  name: string,
  description: string,
  numOfQuiz: number,
  playerLimitNum: number,
  code: string,
  files: File[],
) => {
  try {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('numOfQuiz', String(numOfQuiz));
    formData.append('playerLimitNum', String(playerLimitNum));
    formData.append('code', code);
    formData.append('files', files[0], files[0].name);

    // formData.append(`files`, fs.createReadStream(files[0].name));

    const response = await client.post('/rooms', formData.getBuffer(), {
      headers: {
        // ...formData.getHeaders(),
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response.data.exceptionCode > 1000)
      throw new Error(error.response.data.message);
    else throw new Error('오류가 발생했습니다.');
  }
};

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function createRoomHandler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.error('파일 업로드 중 오류:', err);
//       res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', String(fields.name || ''));
//       formData.append('description', String(fields.description || ''));
//       formData.append('numOfQuiz', String(fields.numOfQuiz || ''));
//       formData.append('playerLimitNum', String(fields.playerLimitNum || ''));
//       formData.append('code', String(fields.code || ''));

//       // 파일을 읽어서 FormData에 추가
//       if (Array.isArray(files.file)) {
//         // 파일이 배열인 경우, 첫 번째 파일을 선택하여 추가
//         const file = files.file[0];
//         const readStream = fs.createReadStream(file.filepath);
//         formData.append('file', readStream);
//       }

//       const config = {
//         method: 'post',
//         url: `/rooms`,
//         headers: {
//           Authorization: `Bearer  ${useAuthStore.getState().accessToken}`,
//           ...formData.getHeaders(),
//         },
//         data: formData,
//       };

//       await client(config);

//       res.status(200).json({ formData: formData });
//     } catch (error) {
//       console.error('파일 처리 중 오류:', error);
//       res.status(500).json({ error: '파일 처리 중 오류가 발생했습니다.' });
//     }
//   });
// }
