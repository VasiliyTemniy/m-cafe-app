import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { Order, OrderS } from '../domain';
import type { OrderFoodDT, OrderFoodDTN } from './OrderFoodDT.js';
import type { FacilityDTS } from './FacilityDT.js';
import type { UserDT } from './UserDT.js';
import type { AddressDT } from './AddressDT.js';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { isAddressDT } from './AddressDT.js';
import { isUserDT } from './UserDT.js';
import { isOrderFoodDTN, isOrderFoodDTS } from './OrderFoodDT.js';
import { isFacilityDTS } from './FacilityDT.js';
import { idRequired } from './validationHelpers';


const orderPropertiesGroups: PropertyGroup[] = [{
  properties: ['deliverAt', 'status', 'customerPhonenumber', 'archiveAddress'],
  validator: isString
}, {
  properties: ['customerName'],
  required: false,
  validator: isString
}, {
  properties: ['totalCost'],
  validator: isNumber
}, {
  properties: ['facility'],
  validator: isFacilityDTS
}];

const hasOrderFoodsProperty: PropertyGroup = {
  properties: ['orderFoods'],
  validator: isOrderFoodDTS,
  isArray: true
};

const hasUserOptionalProperty: PropertyGroup = {
  properties: ['user'],
  required: false,
  validator: isUserDT,
};

const hasAddressOptionalProperty: PropertyGroup = {
  properties: ['address'],
  required: false,
  validator: isAddressDT,
};


/**
 * Order contains user info such as customerPhonenumber and archiveAddress as string,
 * info about facility, totalCost, orderFoods, status, deliverAt,
 * optionally contains customerName, full user-customer record,
 * full address record \
 * Customer name is optional because order can be created without logging into the app,
 * somebody can provide phonenumber but not name, name must be questioned by manager
 * while calling to ensure order creation
 */
export type OrderDT = Omit<MapToDT<Order>, 'orderFoods' | 'facility' | 'user' | 'address' | 'deliverAt'> & {
  deliverAt: string;
  orderFoods: OrderFoodDT[];
  facility: FacilityDTS;
  user?: UserDT;
  address?: AddressDT;
};

export const isOrderDT = (obj: unknown): obj is OrderDT =>
  isEntity(obj, [
    idRequired,
    hasUserOptionalProperty,
    hasAddressOptionalProperty,
    hasOrderFoodsProperty,
    ...orderPropertiesGroups
  ]);



const hasNewOrderFoodsProperty: PropertyGroup = {
  properties: ['orderFoods'],
  validator: isOrderFoodDTN,
  isArray: true
};

export type OrderDTN = Omit<MapToDTN<Order>, 'orderFoods' | 'facility' | 'user' | 'address' | 'deliverAt'> & {
  deliverAt: string;
  orderFoods: OrderFoodDTN[];
  facility: FacilityDTS;
  user?: UserDT;
  address?: AddressDT;
};

export const isOrderDTN = (obj: unknown): obj is OrderDTN =>
  isEntity(obj, [ 
    hasUserOptionalProperty,
    hasAddressOptionalProperty,
    hasNewOrderFoodsProperty,
    ...orderPropertiesGroups
  ]);


/**
 * Contains only most necessary info about the order
 */
export type OrderDTS = Omit<MapToDT<OrderS>, 'orderFoods' | 'facility' | 'deliverAt'> & {
  deliverAt: string;
  orderFoods: OrderFoodDT[];
  facility: FacilityDTS;
};

export const isOrderDTS = (obj: unknown): obj is OrderDTS =>
  isEntity(obj, [
    idRequired,
    hasOrderFoodsProperty,
    ...orderPropertiesGroups
  ]);