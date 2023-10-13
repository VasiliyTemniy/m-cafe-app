import type { FacilityDT } from '../../models/Facility.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import type { EditAddressBody, NewAddressBody } from './AddressBodies.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { isEditAddressBody, isNewAddressBody } from './AddressBodies.js';
import { checkProperties } from '../typeValidators.js';

export type NewFacilityBody = Omit<FacilityDT, 'id' | 'nameLoc' | 'descriptionLoc' | 'address'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
  address: NewAddressBody;
};

export const isNewFacilityBody = (obj: unknown): obj is NewFacilityBody => {

  if (!checkProperties({ obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isNewLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'address'
  ], required: true, validator: isNewAddressBody })) return false;

  return true;
};


export type EditFacilityBody = Omit<NewFacilityBody, 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: EditLocString;
  descriptionLoc: EditLocString;
  address: EditAddressBody;
};

export const isEditFacilityBody = (obj: unknown): obj is EditFacilityBody => {

  if (!checkProperties({ obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isEditLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'address'
  ], required: true, validator: isEditAddressBody })) return false;

  return true;
};