import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FixedLocDT } from '@m-cafe-app/models';
import { FixedLoc } from '@m-cafe-app/models';
import { FixedLoc as FixedLocPG } from '@m-cafe-app/db';
import { ApplicationError, toOptionalISOString } from '@m-cafe-app/utils';


export class FixedLocMapper implements EntityDBMapper<FixedLoc, FixedLocPG>, EntityDTMapper<FixedLoc, FixedLocDT> {

  public static dbToDomain(dbFixedLoc: FixedLocPG): FixedLoc {
    if (!dbFixedLoc.locString)
      throw new ApplicationError('FixedLoc data corrupt: locString is missing check for wrong db include clause');

    const domainFixedLoc = new FixedLoc(
      dbFixedLoc.id,
      dbFixedLoc.name,
      dbFixedLoc.namespace,
      dbFixedLoc.scope,
      {
        id: dbFixedLoc.locString.id,
        mainStr: dbFixedLoc.locString.mainStr,
        secStr: dbFixedLoc.locString.secStr,
        altStr: dbFixedLoc.locString.altStr,
        createdAt: dbFixedLoc.locString.createdAt,
        updatedAt: dbFixedLoc.locString.updatedAt
      }
    );
    return domainFixedLoc;
  }

  dbToDomain(dbFixedLoc: FixedLocPG): FixedLoc {
    return FixedLocMapper.dbToDomain(dbFixedLoc);
  }

  public static dtToDomain(fixedLocDT: FixedLocDT): FixedLoc {
    const domainFixedLoc = new FixedLoc(
      fixedLocDT.id,
      fixedLocDT.name,
      fixedLocDT.namespace,
      fixedLocDT.scope,
      {
        id: fixedLocDT.locString.id,
        mainStr: fixedLocDT.locString.mainStr,
        secStr: fixedLocDT.locString.secStr,
        altStr: fixedLocDT.locString.altStr,
        // timestamps should not be passed to domain from frontend
        // createdAt: fixedLocDT.locString.createdAt,
        // updatedAt: fixedLocDT.locString.updatedAt
      }
    );
    return domainFixedLoc;
  }
  
  dtToDomain(fixedLocDT: FixedLocDT): FixedLoc {
    return FixedLocMapper.dtToDomain(fixedLocDT);
  }

  public static domainToDT(domainFixedLoc: FixedLoc): FixedLocDT {
    const fixedLocDT: FixedLocDT = {
      id: domainFixedLoc.id,
      name: domainFixedLoc.name,
      namespace: domainFixedLoc.namespace,
      scope: domainFixedLoc.scope,
      locString: {
        id: domainFixedLoc.locString.id,
        mainStr: domainFixedLoc.locString.mainStr,
        secStr: domainFixedLoc.locString.secStr,
        altStr: domainFixedLoc.locString.altStr,
        createdAt: toOptionalISOString(domainFixedLoc.locString.createdAt),
        updatedAt: toOptionalISOString(domainFixedLoc.locString.updatedAt)
      }
    };
    return fixedLocDT;
  }

  domainToDT(domainFixedLoc: FixedLoc): FixedLocDT {
    return FixedLocMapper.domainToDT(domainFixedLoc);
  }

}