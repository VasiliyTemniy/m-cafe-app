import type { DynamicModuleDT, DynamicModuleDTN, LocStringDTN, PictureForDynamicModuleDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IDynamicModuleService extends ICRUDService<DynamicModuleDT, DynamicModuleDTN> {
  getAllByPage(page: string): Promise<DynamicModuleDT[]>;
  addLocString(id: number, locStringDTN: LocStringDTN): Promise<DynamicModuleDT>;
  removeLocString(id: number): Promise<DynamicModuleDT>;
  addPicture(
    pictureDTN: PictureForDynamicModuleDTN,
    tempFilePath: string,
    originalFileName: string
  ): Promise<DynamicModuleDT>;
  removePicture(id: number): Promise<DynamicModuleDT>;
}