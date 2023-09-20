import type { MapToUnknown } from "../helpers.js";
import type { OrderDT } from "../../models/Order.js";
import type { OrderFoodDT } from "../../models/OrderFood.js";
import type { NewAddressBody } from "./AddressBodies.js";
import { isAddressDT } from "../../models/Address.js";
import { hasOwnProperty } from "../helpers.js";
import { isNumber, isString } from "../typeParsers.js";
import { isNewAddressBody } from "./AddressBodies.js";

export type NewOrderBody = Omit<OrderDT, 'id' | 'totalCost' | 'user' | 'orderFoods' | 'status' | 'archiveAddress' | 'facility'>
& {
  orderFoods: NewOrderFood[];
  newAddress?: NewAddressBody;
  facilityId: number;
};

type NewOrderBodyFields = MapToUnknown<NewOrderBody>;


export type NewOrderFood = Omit<OrderFoodDT, 'id' | 'archivePrice' | 'archiveFoodName' | 'food'>
& {
  foodId: number;
};

type NewOrderFoodFields = MapToUnknown<NewOrderFood>;

const hasNewOrderFoodFields = (obj: unknown): obj is NewOrderFoodFields =>
  hasOwnProperty(obj, 'amount')
  &&
  hasOwnProperty(obj, 'foodId');

export const isNewOrderFood = (obj: unknown): obj is NewOrderFood =>
  hasNewOrderFoodFields(obj)
  &&
  isNumber(obj.amount)
  &&
  isNumber(obj.foodId);


const hasNewOrderBodyFields = (body: unknown): body is NewOrderBodyFields =>
  hasOwnProperty(body, 'orderFoods')
  &&
  hasOwnProperty(body, 'deliverAt')
  &&
  (
    hasOwnProperty(body, 'address')
    ||
    hasOwnProperty(body, 'newAddress')
  )
  &&
  hasOwnProperty(body, 'customerPhonenumber')
  &&
  hasOwnProperty(body, 'facilityId');

export const isNewOrderBody = (body: unknown): body is NewOrderBody => {
  if (!hasNewOrderBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, 'address') && !isAddressDT(body.address))
    ||
    (hasOwnProperty(body, 'newAddress') && !isNewAddressBody(body.newAddress))
    ||
    (hasOwnProperty(body, "customerName") && !isString(body.customerName))
  )
    return false;

  if (!Array.isArray(body.orderFoods)) return false;
  for (const orderFood of body.orderFoods)
    if (!isNewOrderFood(orderFood)) return false;

  return isString(body.deliverAt) && isString(body.customerPhonenumber) && isNumber(body.facilityId);
};


export type EditOrderBody = Omit<NewOrderBody, 'orderFoods'>
& {
  orderFoods: NewOrderFood[];
};

type EditOrderBodyFields = MapToUnknown<EditOrderBody>;

const hasEditOrderBodyFields = (body: unknown): body is EditOrderBodyFields =>
  hasNewOrderBodyFields(body);

export const isEditOrderBody = (body: unknown): body is EditOrderBody => {
  if (!hasEditOrderBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, 'address') && !isAddressDT(body.address))
    ||
    (hasOwnProperty(body, 'newAddress') && !isNewAddressBody(body.newAddress))
    ||
    (hasOwnProperty(body, "customerName") && !isString(body.customerName))
  )
    return false;

  if (!Array.isArray(body.orderFoods)) return false;
  for (const orderFood of body.orderFoods)
    // It's still `new order food` here because of design - on put route,
    // all the order foods get deleted and recreated
    if (!isNewOrderFood(orderFood)) return false;

  return isString(body.deliverAt) && isString(body.customerPhonenumber) && isNumber(body.facilityId);
};


export type EditOrderStatusBody = {
  status: string
};

const hasEditOrderStatusBodyFields = (body: unknown): body is { status: unknown } =>
  hasOwnProperty(body, 'status');

export const isEditOrderStatusBody = (body: unknown): body is EditOrderStatusBody =>
  hasEditOrderStatusBodyFields(body)
  &&
  isString(body.status);