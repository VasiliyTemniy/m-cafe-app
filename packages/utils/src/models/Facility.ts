import { FacilityData } from "@m-cafe-app/db-models";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isLocStringDT, LocStringDT } from "./LocString.js";
import { AddressDT, isAddressDT } from "./Address.js";
import { isUserDT, UserDT } from "./User.js";
import { isStockDT, StockDT } from "./Stock.js";


export type FacilityDT = Omit<MapToDT<FacilityData>, 'nameLocId' | 'descriptionLocId' | 'addressId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  address: AddressDT;
  managers?: UserDT[];
  stocks?: StockDT[];
};

type FacilityDTFields = MapToUnknown<FacilityDT>;

const hasFacilityDTFields = (obj: unknown): obj is FacilityDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc")
  &&
  hasOwnProperty(obj, "descriptionLoc")
  &&
  hasOwnProperty(obj, "address");

export const isFacilityDT = (obj: unknown): obj is FacilityDT => {
  if (!hasFacilityDTFields(obj)) return false;

  if (obj.managers) {
    if (!Array.isArray(obj.managers)) return false;
    for (const manager of obj.managers)
      if (!isUserDT(manager)) return false;
  }

  if (obj.stocks) {
    if (!Array.isArray(obj.stocks)) return false;
    for (const stock of obj.stocks)
      if (!isStockDT(stock)) return false;
  }

  return isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc)
  &&
  isLocStringDT(obj.descriptionLoc)
  &&
  isAddressDT(obj.address);
};



export type FacilityDTS = Omit<FacilityDT, 'descriptionLoc' | 'address' | 'managers' | 'stocks'>
& {
  nameLoc: LocStringDT;
};

type FacilityDTSFields = MapToUnknown<FacilityDTS>;

const hasFacilityDTSFields = (obj: unknown): obj is FacilityDTSFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc");

export const isFacilityDTS = (obj: unknown): obj is FacilityDTS =>
  hasFacilityDTSFields(obj)
  &&
  isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc);