import { FacilityDT } from "../../models/Facility.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { EditLocString, isEditLocString, isNewLocString, NewLocString } from "../../models/LocString.js";
import { EditAddressBody, isEditAddressBody, isNewAddressBody, NewAddressBody } from "./AddressBodies.js";

export type NewFacilityBody = Omit<FacilityDT, 'id' | 'nameLoc' | 'descriptionLoc' | 'address'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
  address: NewAddressBody;
};

type NewFacilityBodyFields = MapToUnknown<NewFacilityBody>;

const hasNewFacilityBodyFields = (body: unknown): body is NewFacilityBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'descriptionLoc') && hasOwnProperty(body, 'address');

export const isNewFacilityBody = (body: unknown): body is NewFacilityBody =>
  hasNewFacilityBodyFields(body)
  &&
  isNewLocString(body.nameLoc)
  &&
  isNewLocString(body.descriptionLoc)
  &&
  isNewAddressBody(body.address);


export type EditFacilityBody = Omit<NewFacilityBody, 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: EditLocString;
  descriptionLoc: EditLocString;
  address: EditAddressBody;
};

type EditFacilityBodyFields = MapToUnknown<EditFacilityBody>;

const hasEditFacilityBodyFields = (body: unknown): body is EditFacilityBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'descriptionLoc') && hasOwnProperty(body, 'address');

export const isEditFacilityBody = (body: unknown): body is EditFacilityBody =>
  hasEditFacilityBodyFields(body)
  &&
  isEditLocString(body.nameLoc)
  &&
  isEditLocString(body.descriptionLoc)
  &&
  isEditAddressBody(body.address);