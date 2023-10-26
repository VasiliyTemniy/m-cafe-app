import type { Picture as PicturePG } from '@m-cafe-app/db';
import type { PictureDT } from '@m-cafe-app/models';
import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import { Picture } from '@m-cafe-app/models';
import { LocStringMapper } from '../../LocString';
import { ApplicationError, toOptionalISOString } from '@m-cafe-app/utils';

export class PictureMapper implements EntityDBMapper<Picture, PicturePG>, EntityDTMapper<Picture, PictureDT> {
  public static dbToDomain(dbPicture: PicturePG): Picture {
    if (!dbPicture.altTextLoc)
      throw new ApplicationError('Picture data corrupt: url or altTextLoc is missing check for wrong db include clause');

    const domainPicture = new Picture(
      dbPicture.id,
      dbPicture.src,
      LocStringMapper.dbToDomain(dbPicture.altTextLoc),
      dbPicture.createdAt,
      dbPicture.updatedAt
    );

    return domainPicture;
  }

  dbToDomain(dbPicture: PicturePG): Picture {
    return PictureMapper.dbToDomain(dbPicture);
  }

  public static dtToDomain(pictureDT: PictureDT): Picture {
    const domainPicture = new Picture(
      pictureDT.id,
      pictureDT.src,
      LocStringMapper.dtToDomain(pictureDT.altTextLoc),
      // timestamps are not accepted from frontend
      // pictureDT.createdAt,
      // pictureDT.updatedAt
    );
    return domainPicture;
  }

  dtToDomain(pictureDT: PictureDT): Picture {
    return PictureMapper.dtToDomain(pictureDT);
  }

  public static domainToDT(domainPicture: Picture): PictureDT {
    const pictureDT: PictureDT = {
      id: domainPicture.id,
      src: domainPicture.src,
      altTextLoc: LocStringMapper.domainToDT(domainPicture.altTextLoc),
      createdAt: toOptionalISOString(domainPicture.createdAt),
      updatedAt: toOptionalISOString(domainPicture.updatedAt)
    };
    return pictureDT;
  }

  domainToDT(domainPicture: Picture): PictureDT {
    return PictureMapper.domainToDT(domainPicture);
  }
}