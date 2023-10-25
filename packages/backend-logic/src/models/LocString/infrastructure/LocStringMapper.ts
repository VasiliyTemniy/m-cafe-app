import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { LocStringDT } from '@m-cafe-app/models';
import { LocString } from '@m-cafe-app/models';
import { LocString as LocStringPG } from '@m-cafe-app/db';
import { toOptionalISOString } from '@m-cafe-app/utils';


export class LocStringMapper implements EntityDBMapper<LocString, LocStringPG>, EntityDTMapper<LocString, LocStringDT> {

  public static dbToDomain(dbLocString: LocStringPG): LocString {
    const domainLocString = new LocString(
      dbLocString.id,
      dbLocString.mainStr,
      dbLocString.secStr,
      dbLocString.altStr,
      dbLocString.createdAt,
      dbLocString.updatedAt
    );
    return domainLocString;
  }

  dbToDomain(dbLocString: LocStringPG): LocString {
    return LocStringMapper.dbToDomain(dbLocString);
  }

  public static dtToDomain(locStringDT: LocStringDT): LocString {
    const domainLocString = new LocString(
      locStringDT.id,
      locStringDT.mainStr,
      locStringDT.secStr,
      locStringDT.altStr,
      // timestamps are not accepted from frontend
      // toOptionalDate(locStringDT.createdAt),
      // toOptionalDate(locStringDT.updatedAt)
    );
    return domainLocString;
  }
  
  dtToDomain(locStringDT: LocStringDT): LocString {
    return LocStringMapper.dtToDomain(locStringDT);
  }

  public static domainToDT(domainLocString: LocString): LocStringDT {
    const locStringDT: LocStringDT = {
      id: domainLocString.id,
      mainStr: domainLocString.mainStr,
      secStr: domainLocString.secStr,
      altStr: domainLocString.altStr,
      createdAt: toOptionalISOString(domainLocString.createdAt),
      updatedAt: toOptionalISOString(domainLocString.updatedAt)
    };
    return locStringDT;
  }

  domainToDT(domainLocString: LocString): LocStringDT {
    return LocStringMapper.domainToDT(domainLocString);
  }

}