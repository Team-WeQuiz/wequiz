import axios from 'axios';

type CompletedPartType = {
  ETag: string;
  PartNumber: number;
};

// 파일을 파트로 쪼개고, 해당 배열 생성
export const createChunkedArray = async (
  file: File,
  chunkSize: number,
): Promise<Blob[]> => {
  const chunkedArray: Blob[] = [];
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunkedArray.push(chunk);
    offset += chunkSize;
  }

  return chunkedArray;
};

// 멀티파트 업로드 알림
export const getIdForMultipartUpload = async (
  fileName: string,
  fileType: string,
): Promise<string> => {
  try {
    const response = await axios.post('/api/s3-upload/get-id', {
      data: { fileName, fileType },
      action: 'get-id',
    });
    return response.data.UploadId;
  } catch (error) {
    console.error('Error obtaining upload ID:', error);
    throw error;
  }
};

// 각 청크 별로 presigned url 요청
export const getUploadUrlForChunk = async (
  fileName: string,
  partNumber: number,
  uploadId: string,
): Promise<string> => {
  try {
    const response = await axios.post('/api/s3-upload/get-url', {
      data: {
        fileName,
        partNumber,
        uploadId,
      },
      action: 'get-url',
    });
    return response.data;
  } catch (error) {
    console.error('Error obtaining upload URL:', error);
    throw error;
  }
};

// 멀티파트 업로드 완료
export const closeMultipartUpload = async (
  fileName: string,
  uploadId: string,
  completedParts: CompletedPartType[],
): Promise<object | void> => {
  try {
    await axios.post('/api/s3-upload/complete', {
      data: { fileName, uploadId, parts: completedParts },
      action: 'complete-upload',
    });
  } catch (error) {
    console.error('Error completing upload:', error);
    throw error;
  }
};

const getUrl = async (fileName: string) => {
  try {
    const response = await axios.post('/api/s3-upload/get-geturl', {
      data: { fileName },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const handleUpload = async (
  file: File,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsUploaded: React.Dispatch<React.SetStateAction<boolean>>,
  setUrl: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  setIsUploading(true);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  let uploadedChunk = 0; // progress 추적하기 위함
  try {
    const chunkedFile = await createChunkedArray(file, CHUNK_SIZE);
    const uploadId = await getIdForMultipartUpload(file.name, file.type);
    // 청크 배열을 순회하여 각 청크별로 업로드 요청 보냄
    const uploadPromises = chunkedFile.map(async (chunk, index) => {
      const uploadUrl = await getUploadUrlForChunk(
        file.name,
        index + 1,
        uploadId,
      );
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: chunk,
        headers: {
          'Content-Type': file.type,
        },
      });
      uploadedChunk++;
      const progress = Math.ceil((uploadedChunk / chunkedFile.length) * 100);
      setUploadProgress(progress);
      if (!response.ok) throw new Error('Upload failed');
      return {
        ETag: response.headers.get('ETag') ?? '',
        PartNumber: index + 1,
      };
    });

    const completedParts: CompletedPartType[] =
      await Promise.all(uploadPromises);
    await closeMultipartUpload(file.name, uploadId, completedParts);
    const url = await getUrl(file.name);
    setUrl(url);
    setIsUploaded(true);
  } catch (error) {
    console.error('Upload error:', error);
    setIsUploaded(false);
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};
