import { hasOwnProperty, MapToUnknown } from "../helpers";
import { isBoolean, isNumber, isString } from "../typeParsers";

export type NewPictureBody = {
  type: 'foodPicture' | 'modulePicture',
  main?: boolean,
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  subjectId: number
};

type NewPictureBodyFields = MapToUnknown<NewPictureBody>;

const hasNewPictureBodyFields = (body: unknown): body is NewPictureBodyFields =>
  hasOwnProperty(body, 'type') && hasOwnProperty(body, 'altTextLoc') && hasOwnProperty(body, 'subjectId');

export const isNewPictureBody = (body: unknown): body is NewPictureBody => {
  if (!hasNewPictureBodyFields(body)) return false;

  if (!((body.type === 'foodPicture') || (body.type === 'modulePicture'))) return false;

  if (
    (hasOwnProperty(body, 'main') && !isBoolean(body.main))
    ||
    (hasOwnProperty(body, 'altTextSecStr') && !isString(body.altTextSecStr))
    ||
    (hasOwnProperty(body, "altTextAltStr") && !isString(body.altTextAltStr))
  )
    return false;

  return isString(body.altTextMainStr) && isNumber(body.subjectId);
};


export type EditPictureBody = NewPictureBody;

type EditPictureBodyFields = MapToUnknown<EditPictureBody>;

const hasEditPictureBodyFields = (body: unknown): body is EditPictureBodyFields =>
  hasNewPictureBodyFields(body);

export const isEditPictureBody = (body: unknown): body is EditPictureBody => {
  if (!hasEditPictureBodyFields(body)) return false;
  
  if (!((body.type === 'foodPicture') || (body.type === 'modulePicture'))) return false;
  
  if (
    (hasOwnProperty(body, 'main') && !isBoolean(body.main))
    ||
    (hasOwnProperty(body, 'altTextSecStr') && !isString(body.altTextSecStr))
    ||
    (hasOwnProperty(body, "altTextAltStr") && !isString(body.altTextAltStr))
  )
    return false;
  
  return isString(body.altTextMainStr) && isNumber(body.subjectId);
};