import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FixedLocDT } from '@m-cafe-app/models';
import { FixedLoc } from '@m-cafe-app/models';
import { FixedLoc as FixedLocPG } from '@m-cafe-app/db';
import { ApplicationError } from '@m-cafe-app/utils';
import { LocStringMapper } from '../../LocString';


export class FixedLocMapper implements EntityDBMapper<FixedLoc, FixedLocPG>, EntityDTMapper<FixedLoc, FixedLocDT> {

  public static dbToDomain(dbFixedLoc: FixedLocPG): FixedLoc {
    if (!dbFixedLoc.locString)
      throw new ApplicationError('FixedLoc data corrupt: locString is missing check for wrong db include clause');

    const domainFixedLoc = new FixedLoc(
      dbFixedLoc.id,
      dbFixedLoc.name,
      dbFixedLoc.namespace,
      dbFixedLoc.scope,
      LocStringMapper.dbToDomain(dbFixedLoc.locString)
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
      LocStringMapper.dtToDomain(fixedLocDT.locString)
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
      locString: LocStringMapper.domainToDT(domainFixedLoc.locString)
    };
    return fixedLocDT;
  }

  domainToDT(domainFixedLoc: FixedLoc): FixedLocDT {
    return FixedLocMapper.domainToDT(domainFixedLoc);
  }

}