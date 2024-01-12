import type { DynamicModule, DynamicModuleDTN, LocString } from '@m-market-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IDynamicModuleRepo extends ICRUDRepo<DynamicModule, DynamicModuleDTN> {
  getAllByPage(page: string): Promise<DynamicModule[]>;
  create(dynamicModuleDTN: DynamicModuleDTN, locString?: LocString, transaction?: GenericTransaction): Promise<DynamicModule>;
  addLocString(id: number, locStringId: number, transaction?: GenericTransaction): Promise<DynamicModule>;
  removeLocString(id: number, transaction?: GenericTransaction): Promise<DynamicModule>;
  addPicture(id: number, pictureId: number, transaction?: GenericTransaction): Promise<DynamicModule>;
  removePicture(id: number, transaction?: GenericTransaction): Promise<DynamicModule>;
}