import type { FixedLoc, FixedLocDTN, FixedLocS, FixedLocUniquePropertiesGroup, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo, IInmemRepo } from '../../../utils';

export interface IFixedLocRepo extends Omit<ICRUDRepo<FixedLoc, FixedLocDTN>, 'create' | 'update' | 'updateMany'> {
  getByScope(scope: string): Promise<FixedLoc[]>;
  getByUniqueProperties(properties: FixedLocUniquePropertiesGroup): Promise<FixedLoc | undefined>;
  create(fixedLoc: FixedLocDTN, locString: LocString, transaction?: GenericTransaction): Promise<FixedLoc>;
  remove(id: number, transaction?: GenericTransaction): Promise<FixedLoc>;
}

export interface IFixedLocSRepo extends IInmemRepo<FixedLoc, FixedLocS> {
  getMany(scopes?: string[]): Promise<FixedLocS[]>;
}