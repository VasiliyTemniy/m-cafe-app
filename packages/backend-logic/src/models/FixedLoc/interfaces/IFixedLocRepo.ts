import type { FixedLoc, FixedLocDTN, FixedLocS, FixedLocUniquePropertiesGroup } from '@m-cafe-app/models';
import type { ICRUDRepo, IInmemRepo } from '../../../utils';

export interface IFixedLocRepo extends ICRUDRepo<FixedLoc, FixedLocDTN> {
  getByScope(scope: string): Promise<FixedLoc[]>
  getByUniqueProperties(properties: FixedLocUniquePropertiesGroup): Promise<FixedLoc>
}

export interface IFixedLocSRepo extends IInmemRepo<FixedLoc, FixedLocS> {
  getMany(scopes?: string[]): Promise<FixedLocS[]>;
}