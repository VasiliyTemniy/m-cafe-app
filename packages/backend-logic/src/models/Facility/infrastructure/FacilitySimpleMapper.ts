import type { EntitySimpleMapper } from '../../../utils';
import type { FacilityDTS } from '@m-market-app/models';
import { Facility, FacilityS } from '@m-market-app/models';
import { Facility as FacilityPG } from '@m-market-app/db';
import { ApplicationError } from '@m-market-app/utils';
import { LocStringMapper } from '../../LocString';


export class FacilitySimpleMapper implements EntitySimpleMapper<Facility, FacilityS, FacilityPG, FacilityDTS> {

  public static domainToSimple(domainFacility: Facility): FacilityS {
    const facilityS = new FacilityS(
      domainFacility.id,
      domainFacility.nameLoc,
      domainFacility.descriptionLoc
    );
    return facilityS;
  }

  domainToSimple(domainFacility: Facility): FacilityS {
    return FacilitySimpleMapper.domainToSimple(domainFacility);
  }

  public static dbToSimple(dbFacility: FacilityPG): FacilityS {
    if (!dbFacility.nameLoc || !dbFacility.descriptionLoc)
      throw new ApplicationError('Facility data corrupt: nameLoc or descriptionLoc is missing check for wrong db include clause');

    const facilityS = new FacilityS(
      dbFacility.id,
      LocStringMapper.dbToDomain(dbFacility.nameLoc),
      LocStringMapper.dbToDomain(dbFacility.descriptionLoc)
    );

    return facilityS;
  }

  dbToSimple(dbFacility: FacilityPG): FacilityS {
    return FacilitySimpleMapper.dbToSimple(dbFacility);
  }

  public static dtsToSimple(facilityDTS: FacilityDTS): FacilityS {
    const facilityS = new FacilityS(
      facilityDTS.id,
      LocStringMapper.dtToDomain(facilityDTS.nameLoc),
      LocStringMapper.dtToDomain(facilityDTS.descriptionLoc)
    );
    return facilityS;
  }

  dtsToSimple(facilityDTS: FacilityDTS): FacilityS {
    return FacilitySimpleMapper.dtsToSimple(facilityDTS);
  }

  public static simpleToDTS(facilityS: FacilityS): FacilityDTS {
    const facilityDTS: FacilityDTS = {
      id: facilityS.id,
      nameLoc: LocStringMapper.domainToDT(facilityS.nameLoc),
      descriptionLoc: LocStringMapper.domainToDT(facilityS.descriptionLoc)
    };
    return facilityDTS;
  }

  simpleToDTS(facilityS: FacilityS): FacilityDTS {
    return FacilitySimpleMapper.simpleToDTS(facilityS);
  }

}