import type { LocString, Picture } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IPictureRepo extends Omit<ICRUDRepo<Picture, Picture>, 'create' | 'update'> {
  create(src: string, altTextLoc: LocString, transaction?: GenericTransaction): Promise<Picture>;
  update(id: number, src: string, transaction?: GenericTransaction): Promise<Picture>;
  removeWithCount(ids: number[], transaction?: GenericTransaction): Promise<number>;
}