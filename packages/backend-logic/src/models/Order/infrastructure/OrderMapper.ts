import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { OrderDT } from '@m-cafe-app/models';
import { Order } from '@m-cafe-app/models';
import { Order as OrderPG } from '@m-cafe-app/db';
import { OrderFoodMapper } from '../../OrderFood';
import { DatabaseError, toOptionalISOString } from '@m-cafe-app/utils';
import { FacilitySimpleMapper } from '../../Facility';
import { UserMapper } from '../../User';
import { AddressMapper } from '../../Address';


export class OrderMapper implements EntityDBMapper<Order, OrderPG>, EntityDTMapper<Order, OrderDT> {

  public static dbToDomain(dbOrder: OrderPG): Order {
    if (!dbOrder.orderFoods) {
      throw new DatabaseError('Order data corrupt: orderFoods is missing check include clause');
    }
    if (!dbOrder.facility) {
      throw new DatabaseError('Order data corrupt: facility is missing check include clause');
    }

    const orderFoods = dbOrder.orderFoods.map(dbOrderFood => OrderFoodMapper.dbToDomain(dbOrderFood));
    const facility = FacilitySimpleMapper.dbToSimple(dbOrder.facility);

    const user = dbOrder.user ? UserMapper.dbToDomain(dbOrder.user) : undefined;
    const address = dbOrder.address ? AddressMapper.dbToDomain(dbOrder.address) : undefined;

    const domainOrder = new Order(
      dbOrder.id,
      dbOrder.deliverAt,
      dbOrder.status,
      orderFoods,
      facility,
      dbOrder.totalCost,
      dbOrder.archiveAddress,
      dbOrder.customerPhonenumber,
      dbOrder.customerName,
      dbOrder.paymentMethod,
      dbOrder.paymentStatus,
      dbOrder.tablewareQuantity,
      dbOrder.comment ? dbOrder.comment : undefined,
      user,
      address,
      dbOrder.createdAt,
      dbOrder.updatedAt
    );
    return domainOrder;
  }

  dbToDomain(dbOrder: OrderPG): Order {
    return OrderMapper.dbToDomain(dbOrder);
  }

  public static dtToDomain(orderDT: OrderDT): Order {

    const orderFoods = orderDT.orderFoods.map(orderFoodDT => OrderFoodMapper.dtToDomain(orderFoodDT));
    const facility = FacilitySimpleMapper.dtsToSimple(orderDT.facility);

    const user = orderDT.user ? UserMapper.dtToDomain(orderDT.user) : undefined;
    const address = orderDT.address ? AddressMapper.dtToDomain(orderDT.address) : undefined;

    const domainOrder = new Order(
      orderDT.id,
      new Date(orderDT.deliverAt),
      orderDT.status,
      orderFoods,
      facility,
      orderDT.totalCost,
      orderDT.archiveAddress,
      orderDT.customerPhonenumber,
      orderDT.customerName,
      orderDT.paymentMethod,
      orderDT.paymentStatus,
      orderDT.tablewareQuantity,
      orderDT.comment ? orderDT.comment : undefined,
      user,
      address
    );
    return domainOrder;
  }
  
  dtToDomain(orderDT: OrderDT): Order {
    return OrderMapper.dtToDomain(orderDT);
  }

  public static domainToDT(domainOrder: Order): OrderDT {

    const orderFoodsDTS = domainOrder.orderFoods.map(orderFood => OrderFoodMapper.domainToDT(orderFood));
    const facilityDTS = FacilitySimpleMapper.simpleToDTS(domainOrder.facility);

    const userDT = domainOrder.user ? UserMapper.domainToDT(domainOrder.user) : undefined;
    const addressDT = domainOrder.address ? AddressMapper.domainToDT(domainOrder.address) : undefined;

    const orderDT: OrderDT = {
      id: domainOrder.id,
      deliverAt: domainOrder.deliverAt.toISOString(),
      status: domainOrder.status,
      orderFoods: orderFoodsDTS,
      facility: facilityDTS,
      totalCost: domainOrder.totalCost,
      archiveAddress: domainOrder.archiveAddress,
      customerPhonenumber: domainOrder.customerPhonenumber,
      customerName: domainOrder.customerName,
      user: userDT,
      address: addressDT,
      paymentMethod: domainOrder.paymentMethod,
      paymentStatus: domainOrder.paymentStatus,
      tablewareQuantity: domainOrder.tablewareQuantity,
      comment: domainOrder.comment,
      createdAt: toOptionalISOString(domainOrder.createdAt),
      updatedAt: toOptionalISOString(domainOrder.updatedAt)
    };
    return orderDT;
  }

  domainToDT(domainOrder: Order): OrderDT {
    return OrderMapper.domainToDT(domainOrder);
  }

}