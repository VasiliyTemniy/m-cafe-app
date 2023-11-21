import type { Address, Facility, FacilityDTN, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IFacilityRepo extends ICRUDRepo<Facility, FacilityDTN> {
  create(
    facilityDTN: FacilityDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    address: Address,
    transaction?: GenericTransaction
  ): Promise<Facility>;
  update(
    facility: Facility,
    updAddressId: number,
    transaction?: GenericTransaction
  ): Promise<Facility>;
  getAllWithManagers(): Promise<Facility[]>;
  getAllWithStocks(): Promise<Facility[]>;
  getAllWithFullData(): Promise<Facility[]>;
  getByIdWithManagers(id: number): Promise<Facility>;
  getByIdWithStocks(id: number): Promise<Facility>;
  getByIdWithFullData(id: number): Promise<Facility>;
  addManagers(
    addManagersData: Array<{ facilityId: number, userId: number }>,
    transaction?: GenericTransaction
  ): Promise<number>;
  removeManagers(
    removeManagersData: Array<{ facilityId: number, userId: number }>,
    transaction?: GenericTransaction
  ): Promise<number>;
}