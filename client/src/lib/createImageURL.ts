export const createImageURL = (
  data: File
): string => {
  return URL.createObjectURL(data) 
};

export const destroyImageURL = (
  url: string
): void => {
  return URL.revokeObjectURL(url) 
};