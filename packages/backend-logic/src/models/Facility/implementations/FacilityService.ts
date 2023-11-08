import type { FacilityDT, FacilityDTN } from '@m-cafe-app/models';
import type { IFacilityRepo, IFacilityService } from '../interfaces';
import { FacilityMapper } from '../infrastructure';


export class FacilityService implements IFacilityService {
  constructor( readonly dbRepo: IFacilityRepo ) {}

  async getAll(): Promise<FacilityDT[]> {
    const facilities = await this.dbRepo.getAll();

    return facilities.map(facility => FacilityMapper.domainToDT(facility));
  }

  async getById(id: number): Promise<FacilityDT> {
    const facility = await this.dbRepo.getById(id);

    return FacilityMapper.domainToDT(facility);
  }

  async create(facilityDTN: FacilityDTN): Promise<FacilityDT> {
    const savedFacility = await this.dbRepo.create(facilityDTN);

    return FacilityMapper.domainToDT(savedFacility);
  }

  async update(facility: FacilityDT): Promise<FacilityDT> {
    const updatedFacility = await this.dbRepo.update(FacilityMapper.dtToDomain(facility));

    return FacilityMapper.domainToDT(updatedFacility);
  }

  async remove(id: number): Promise<void> {
    await this.dbRepo.remove(id);
  }

  async removeAll(): Promise<void> {
    await this.dbRepo.removeAll();
  }
}