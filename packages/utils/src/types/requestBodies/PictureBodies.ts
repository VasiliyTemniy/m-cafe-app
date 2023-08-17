import { hasOwnProperty, MapToUnknown } from "../helpers";
import { isNumber, isString } from "../typeParsers";

/**
 * This request body is not connected with PictureDT because picture file is
 * sent via multipart/form-data, so all body fields are pure text fields
 */

export type NewPictureBody = {
  type: 'foodPicture' | 'modulePicture',
  main?: 'true' | 'false',
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  subjectId: string
};

type NewPictureBodyFields = MapToUnknown<NewPictureBody>;

const hasNewPictureBodyFields = (body: unknown): body is NewPictureBodyFields =>
  hasOwnProperty(body, 'type') && hasOwnProperty(body, 'altTextLoc') && hasOwnProperty(body, 'subjectId');

export const isNewPictureBody = (body: unknown): body is NewPictureBody => {
  if (!hasNewPictureBodyFields(body)) return false;

  if (!((body.type === 'foodPicture') || (body.type === 'modulePicture'))) return false;

  if (
    (hasOwnProperty(body, 'main') && !((body.main === 'true') || (body.main === 'false')))
    ||
    (hasOwnProperty(body, 'altTextSecStr') && !isString(body.altTextSecStr))
    ||
    (hasOwnProperty(body, "altTextAltStr") && !isString(body.altTextAltStr))
  )
    return false;

  return isString(body.altTextMainStr) && isNumber(Number(body.subjectId));
};


export type EditPictureBody = NewPictureBody;

type EditPictureBodyFields = MapToUnknown<EditPictureBody>;

const hasEditPictureBodyFields = (body: unknown): body is EditPictureBodyFields =>
  hasNewPictureBodyFields(body);

export const isEditPictureBody = (body: unknown): body is EditPictureBody => {
  if (!hasEditPictureBodyFields(body)) return false;
  
  if (!((body.type === 'foodPicture') || (body.type === 'modulePicture'))) return false;

  if (
    (hasOwnProperty(body, 'main') && !((body.main === 'true') || (body.main === 'false')))
    ||
    (hasOwnProperty(body, 'altTextSecStr') && !isString(body.altTextSecStr))
    ||
    (hasOwnProperty(body, "altTextAltStr") && !isString(body.altTextAltStr))
  )
    return false;

  return isString(body.altTextMainStr) && isNumber(Number(body.subjectId));
};