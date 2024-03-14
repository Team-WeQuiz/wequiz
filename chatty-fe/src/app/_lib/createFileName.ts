export const createFileName = (fileName: string) => {
  const parts = fileName.split('.');
  const extension = parts.pop();
  const baseName = parts.join('.');

  const uniqueFileName = `${baseName}_${Date.now()}.${extension}`;
  return uniqueFileName;
};
