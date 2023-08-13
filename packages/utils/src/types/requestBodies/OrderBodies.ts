import { isAddressDT } from "../../models/Address.js";
import { OrderDT } from "../../models/Order.js";
import { OrderFoodDT } from "../../models/OrderFood.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { isNumber, isString } from "../typeParsers.js";
import { isNewAddressBody, NewAddressBody } from "./AddressBodies.js";

export type NewOrderBody = Omit<OrderDT, 'id' | 'totalCost' | 'user' | 'orderFoods' | 'status' | 'archiveAddress'>
& {
  orderFoods: NewOrderFood[];
  newAddress?: NewAddressBody;
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
  hasOwnProperty(body, 'customerPhonenumber');

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

  return isString(body.deliverAt) && isString(body.customerPhonenumber);
};


export type EditOrderBody = Omit<NewOrderBody, 'orderFoods'>
& {
  orderFoods: EditOrderFood[];
};

type EditOrderBodyFields = MapToUnknown<EditOrderBody>;

export type EditOrderFood = NewOrderFood & { id: number };

type EditOrderFoodFields = MapToUnknown<EditOrderFood>;


const hasEditOrderFoodFields = (obj: unknown): obj is EditOrderFoodFields =>
  hasNewOrderFoodFields(obj)
  &&
  hasOwnProperty(obj, 'id');

export const isEditOrderFood = (obj: unknown): obj is EditOrderFood =>
  hasEditOrderFoodFields(obj)
  &&
  isNumber(obj.amount)
  &&
  isNumber(obj.foodId)
  &&
  isNumber(obj.id);



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
    if (!isEditOrderFood(orderFood)) return false;

  return isString(body.deliverAt);
};