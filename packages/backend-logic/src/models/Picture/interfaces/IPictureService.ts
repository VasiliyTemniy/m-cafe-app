import type { LocString, LocStringDTN, PictureDT } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDService } from '../../../utils';


export interface IPictureService extends Omit<ICRUDService<PictureDT, PictureDT>, 'create'> {
  /**
   * Method to create new picture\
   * Moves file from temp dir to target dir; saves resulting file name + path as src\
  //  * Does not create locStrings - those must be created by other service\
   * Accepts transaction from other services
   * @param subjectId - id of picture subject
   * @param altTextLocDTN - alt text loc to create
   * @param tempFilePath - file path
   * @param originalFileName - original file name from client
   * @param type - type of picture
   * @param transaction - optional GenericTransaction from other services
   */
  create(
    subjectId: number,
    altTextLocDTN: LocStringDTN,
    tempFilePath: string,
    originalFileName: string,
    type: 'foodPicture' | 'modulePicture' | 'svg',
    transaction?: GenericTransaction
  ): Promise<PictureDT>;
  /**
   * Method to update picture src\
   * Does not update locStrings - those must be updated by another method
   * @param pictureDT 
   * @param oldPath
   * @param newPath 
   * @param transaction - optional GenericTransaction from other services
   */
  update(
    pictureDT: PictureDT,
    oldPath: string,
    newPath: string,
    transaction?: GenericTransaction
  ): Promise<PictureDT>;
  updateAltTextLoc(
    id: number,
    altTextLoc: LocString,
    transaction?: GenericTransaction
  ): Promise<PictureDT>;
  /**
   * Removes picture data and altTextLoc
   * @param id - picture id
   * @param transaction - optional GenericTransaction from other services
   * @param deleteFile - whether to delete file
   */
  remove(
    id: number,
    transaction?: GenericTransaction,
    deleteFile?: boolean
  ): Promise<void>;
  deletePictureFile(src: string): Promise<void>;
}