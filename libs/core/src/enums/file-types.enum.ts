export enum ImageTypesEnum {
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}
export enum DocumentTypesEnum {
  DOC = 'document',
}
export const allowedFileTypes = {
  ...DocumentTypesEnum,
  ...ImageTypesEnum,
};

export enum allowedFileTypesType {
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  DOC = 'document',
}
