import { MaterialTypesEnum } from 'src/tasks/enums';

export enum ProductTypeEnum {
  PRODUCT = 'PRODUCT',
}

export const ProductType = { ...MaterialTypesEnum, ...ProductTypeEnum };
