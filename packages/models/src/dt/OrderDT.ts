import type { MapToDT, MapToDTN, PropertyGroup } from '@m-market-app/utils';
import type { Order, OrderS } from '../domain';
import type { OrderFoodDTN, OrderFoodDT } from './OrderFoodDT.js';
import type { FacilityDTS } from './FacilityDT.js';
import type { UserDT } from './UserDT.js';
import type { AddressDT } from './AddressDT.js';
import { isEntity, isNumber, isString } from '@m-market-app/utils';
import { isAddressDT } from './AddressDT.js';
import { isUserDT } from './UserDT.js';
import { isOrderFoodDTN, isOrderFoodDT } from './OrderFoodDT.js';
import { isFacilityDTS } from './FacilityDT.js';
import { idRequired } from './validationHelpers';
import { isOrderPaymentMethod, isOrderPaymentStatus, isOrderStatus } from '@m-market-app/shared-constants';


const orderPropertiesGroups: PropertyGroup[] = [{
  properties: ['deliverAt', 'customerPhonenumber'],
  validator: isString
}, {
  properties: ['facility'],
  validator: isFacilityDTS
}];

const hasStatusProperty: PropertyGroup = {
  properties: ['status'],
  validator: isOrderStatus
};

const hasPaymentMethodProperty: PropertyGroup = {
  properties: ['paymentMethod'],
  validator: isOrderPaymentMethod
};

const hasPaymentStatusProperty: PropertyGroup = {
  properties: ['paymentStatus'],
  validator: isOrderPaymentStatus
};

const hasCustomerNameProperty: PropertyGroup = {
  properties: ['customerName'],
  validator: isString
};

const hasCustomerNameOptionalProperty: PropertyGroup = {
  properties: ['customerName'],
  required: false,
  validator: isString
};

const hasArchiveAddressProperty: PropertyGroup = {
  properties: ['archiveAddress'],
  validator: isString
};

const hasTotalCostProperty: PropertyGroup = {
  properties: ['totalCost'],
  validator: isNumber
};

const hasOrderFoodsProperty: PropertyGroup = {
  properties: ['orderFoods'],
  validator: isOrderFoodDT,
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

const hasAddressProperty: PropertyGroup = {
  properties: ['address'],
  validator: isAddressDT,
};

const hasTablewareQuantityProperty: PropertyGroup = {
  properties: ['tablewareQuantity'],
  validator: isNumber
};

const hasCommentOptionalProperty: PropertyGroup = {
  properties: ['comment'],
  required: false,
  validator: isString
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
    hasStatusProperty,
    hasPaymentMethodProperty,
    hasPaymentStatusProperty,
    hasCustomerNameProperty,
    hasUserOptionalProperty,
    hasAddressOptionalProperty,
    hasArchiveAddressProperty,
    hasOrderFoodsProperty,
    hasTotalCostProperty,
    hasTablewareQuantityProperty,
    hasCommentOptionalProperty,
    ...orderPropertiesGroups
  ]);



export type OrderDTN = Omit<MapToDTN<Order>,
 'orderFoods' |
 'facility' |
 'user' |
 'address' |
 'deliverAt' |
 'customerName' |
 'totalCost' |
 'archiveAddress' |
 'status' |
 'paymentStatus'
> & {
  deliverAt: string;
  orderFoods: OrderFoodDTN[];
  facility: FacilityDTS;
  address: AddressDT;
  customerName?: string;
  user?: UserDT;
};

const hasNewOrderFoodsProperty: PropertyGroup = {
  properties: ['orderFoods'],
  validator: isOrderFoodDTN,
  isArray: true
};

export const isOrderDTN = (obj: unknown): obj is OrderDTN =>
  isEntity(obj, [
    hasPaymentMethodProperty,
    hasCustomerNameOptionalProperty,
    hasUserOptionalProperty,
    hasAddressProperty,
    hasNewOrderFoodsProperty,
    hasTablewareQuantityProperty,
    hasCommentOptionalProperty,
    ...orderPropertiesGroups
  ]);


/**
 * Order update info\
 * Optionally contains orderFoods as new ones to rewrite old ones\
 * Other data is similiar to OrderDT
 */
export type OrderDTU = Omit<MapToDT<Order>,
  'orderFoods' | 'facility' | 'user' | 'address' | 'deliverAt' | 'totalCost' | 'archiveAddress'
> & {
  deliverAt: string;
  facility: FacilityDTS;
  orderFoods?: OrderFoodDTN[];
  user?: UserDT;
  address?: AddressDT;
};

const hasNewOrderFoodOptionalProperty: PropertyGroup = {
  properties: ['orderFoods'],
  required: false,
  validator: isOrderFoodDTN,
  isArray: true
};

export const isOrderDTU = (obj: unknown): obj is OrderDTU =>
  isEntity(obj, [
    idRequired,
    hasStatusProperty,
    hasPaymentMethodProperty,
    hasPaymentStatusProperty,
    hasCustomerNameOptionalProperty,
    hasUserOptionalProperty,
    hasAddressOptionalProperty,
    hasNewOrderFoodOptionalProperty,
    hasTablewareQuantityProperty,
    hasCommentOptionalProperty,
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
    hasStatusProperty,
    hasPaymentMethodProperty,
    hasPaymentStatusProperty,
    hasCustomerNameProperty,
    hasArchiveAddressProperty,
    hasOrderFoodsProperty,
    hasTotalCostProperty,
    hasTablewareQuantityProperty,
    ...orderPropertiesGroups
  ]);