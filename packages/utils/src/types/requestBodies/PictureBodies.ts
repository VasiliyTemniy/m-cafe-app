import { checkProperties, isString } from '../typeValidators.js';

/**
 * This request body is not connected with PictureDT because picture file is
 * sent via multipart/form-data, so all body fields are pure text fields
 */

export type NewPictureBody = {
  type: 'foodPicture' | 'modulePicture',
  orderNumber?: string,
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  subjectId: string
};

export const isNewPictureBody = (obj: unknown): obj is NewPictureBody => {

  if (!checkProperties({obj, properties: [
    'altTextMainStr', 'subjectId', 'type'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'altTextSecStr', 'altTextAltStr'
  ], required: false, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'orderNumber'
  ], required: false, validator: (value) => !isNaN(Number(value))})) return false;

  return true;
};


export type EditPictureBody = Omit<NewPictureBody, 'subjectId'>;

export const isEditPictureBody = (obj: unknown): obj is EditPictureBody => {

  if (!checkProperties({obj, properties: [
    'altTextMainStr', 'type'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'altTextSecStr', 'altTextAltStr'
  ], required: false, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'orderNumber'
  ], required: false, validator: (value) => !isNaN(Number(value))})) return false;

  return true;
};