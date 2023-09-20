import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { OrderData } from "@m-cafe-app/db";
import type { UserDT } from "./User.js";
import type { AddressDT } from "./Address.js";
import type { OrderFoodDT } from "./OrderFood.js";
import type { FacilityDTS } from "./Facility.js";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";
import { isUserDT } from "./User.js";
import { isAddressDT } from "./Address.js";
import { isOrderFoodDT } from "./OrderFood.js";
import { isFacilityDTS } from "./Facility.js";


export type OrderDT = Omit<MapToDT<OrderData>, 'userId' | 'addressId' | 'facilityId'>
& {
  user?: UserDT;
  address?: AddressDT;
  orderFoods: OrderFoodDT[];
  facility: FacilityDTS;
};

type OrderDTFields = MapToUnknown<OrderDT>;

const hasOrderDTFields = (obj: unknown): obj is OrderDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "deliverAt")
  &&
  hasOwnProperty(obj, "status")
  &&
  hasOwnProperty(obj, "totalCost")
  &&
  hasOwnProperty(obj, "orderFoods")
  &&
  hasOwnProperty(obj, "archiveAddress")
  &&
  hasOwnProperty(obj, "customerPhonenumber")
  &&
  hasOwnProperty(obj, "facility");

export const isOrderDT = (obj: unknown): obj is OrderDT => {
  if (!hasOrderDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "address") && !isAddressDT(obj.address))
    ||
    (hasOwnProperty(obj, "user") && !isUserDT(obj.user))
    ||
    (hasOwnProperty(obj, "customerName") && !isString(obj.customerName))
  ) return false;

  if (!Array.isArray(obj.orderFoods)) return false;
  for (const orderFood of obj.orderFoods)
    if (!isOrderFoodDT(orderFood)) return false;

  return isNumber(obj.id)
  &&
  isString(obj.deliverAt)
  &&
  isString(obj.status)
  &&
  isNumber(obj.totalCost)
  &&
  isString(obj.archiveAddress)
  &&
  isString(obj.customerPhonenumber)
  &&
  isFacilityDTS(obj.facility);
};


export type OrderDTS = Omit<OrderDT, 'user' | 'orderFoods' | 'address' | 'facility'>
& {
  facilityId: number;
};

type OrderDTSFields = MapToUnknown<OrderDTS>;

const hasOrderDTSFields = (obj: unknown): obj is OrderDTSFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "deliverAt")
  &&
  hasOwnProperty(obj, "status")
  &&
  hasOwnProperty(obj, "totalCost")
  &&
  hasOwnProperty(obj, "archiveAddress")
  &&
  hasOwnProperty(obj, "customerPhonenumber")
  &&
  hasOwnProperty(obj, "facilityId");

export const isOrderDTS = (obj: unknown): obj is OrderDTS => {
  if (!hasOrderDTSFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "customerName") && !isString(obj.customerName))
  ) return false;

  return isNumber(obj.id)
  &&
  isString(obj.deliverAt)
  &&
  isString(obj.status)
  &&
  isNumber(obj.totalCost)
  &&
  isString(obj.archiveAddress)
  &&
  isString(obj.customerPhonenumber)
  &&
  isNumber(obj.facilityId);
};