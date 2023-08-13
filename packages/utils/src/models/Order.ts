import { OrderData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isUserDT, UserDT } from "./User.js";
import { AddressDT, isAddressDT } from "./Address.js";
import { isOrderFoodDT, OrderFoodDT } from "./OrderFood.js";


export type OrderDT = Omit<MapToDT<OrderData>, 'userId' | 'addressId'>
& {
  user?: UserDT;
  address?: AddressDT;
  orderFoods: OrderFoodDT[];
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
  hasOwnProperty(obj, "customerPhonenumber");

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
  isString(obj.customerPhonenumber);
};