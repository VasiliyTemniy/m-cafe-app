import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FacilityDT } from '@m-market-app/models';
import { Facility } from '@m-market-app/models';
import { Facility as FacilityPG } from '@m-market-app/db';
import { ApplicationError, toOptionalISOString } from '@m-market-app/utils';
import { LocStringMapper } from '../../LocString';
import { AddressMapper } from '../../Address';
import { UserMapper } from '../../User/infrastructure';
import { StockSimpleMapper } from '../../Stock';


export class FacilityMapper implements EntityDBMapper<Facility, FacilityPG>, EntityDTMapper<Facility, FacilityDT> {

  public static dbToDomain(dbFacility: FacilityPG): Facility {
    if (!dbFacility.nameLoc || !dbFacility.descriptionLoc)
      throw new ApplicationError('Facility data corrupt: nameLoc or descriptionLoc is missing check for wrong db include clause');

    if (!dbFacility.address)
      throw new ApplicationError('Facility data corrupt: address is missing check for wrong db include clause');

    const managers = dbFacility.managers
      ? dbFacility.managers.map(manager => UserMapper.dbToDomain(manager))
      : undefined;

    const stocks = dbFacility.stocks
      ? dbFacility.stocks.map(stock => StockSimpleMapper.dbToSimple(stock))
      : undefined;

    const domainFacility = new Facility(
      dbFacility.id,
      LocStringMapper.dbToDomain(dbFacility.nameLoc),
      LocStringMapper.dbToDomain(dbFacility.descriptionLoc),
      AddressMapper.dbToDomain(dbFacility.address),
      managers,
      stocks,
      dbFacility.createdAt,
      dbFacility.updatedAt
    );
    return domainFacility;
  }

  dbToDomain(dbFacility: FacilityPG): Facility {
    return FacilityMapper.dbToDomain(dbFacility);
  }

  public static dtToDomain(facilityDT: FacilityDT): Facility {
    const managers = facilityDT.managers
      ? facilityDT.managers.map(manager => UserMapper.dtToDomain(manager))
      : undefined;

    const stocks = facilityDT.stocks
      ? facilityDT.stocks.map(stock => StockSimpleMapper.dtsToSimple(stock))
      : undefined;

    const domainFacility = new Facility(
      facilityDT.id,
      LocStringMapper.dtToDomain(facilityDT.nameLoc),
      LocStringMapper.dtToDomain(facilityDT.descriptionLoc),
      AddressMapper.dtToDomain(facilityDT.address),
      managers,
      stocks,
      // timestamps are not accepted from frontend
      // facilityDT.createdAt,
      // facilityDT.updatedAt
    );
    return domainFacility;
  }
  
  dtToDomain(facilityDT: FacilityDT): Facility {
    return FacilityMapper.dtToDomain(facilityDT);
  }

  public static domainToDT(domainFacility: Facility): FacilityDT {
    const managers = domainFacility.managers
      ? domainFacility.managers.map(manager => UserMapper.domainToDT(manager))
      : undefined;

    const stocks = domainFacility.stocks
      ? domainFacility.stocks.map(stock => StockSimpleMapper.simpleToDTS(stock))
      : undefined;

    const facilityDT: FacilityDT = {
      id: domainFacility.id,
      nameLoc: LocStringMapper.domainToDT(domainFacility.nameLoc),
      descriptionLoc: LocStringMapper.domainToDT(domainFacility.descriptionLoc),
      address: AddressMapper.domainToDT(domainFacility.address),
      managers,
      stocks,
      createdAt: toOptionalISOString(domainFacility.createdAt),
      updatedAt: toOptionalISOString(domainFacility.updatedAt)
    };
    return facilityDT;
  }

  domainToDT(domainFacility: Facility): FacilityDT {
    return FacilityMapper.domainToDT(domainFacility);
  }

}