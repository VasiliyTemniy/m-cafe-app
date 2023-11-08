import type { Facility, FacilityDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';


export interface IFacilityRepo extends ICRUDRepo<Facility, FacilityDTN> {
}