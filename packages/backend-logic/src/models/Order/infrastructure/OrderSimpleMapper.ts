import type { EntitySimpleMapper } from '../../../utils';
import type { Order as OrderPG } from '@m-cafe-app/db';
import type { Order, OrderDTS } from '@m-cafe-app/models';
import { OrderS } from '@m-cafe-app/models';
import { DatabaseError } from '@m-cafe-app/utils';
import { OrderFoodMapper } from '../../OrderFood';
import { FacilitySimpleMapper } from '../../Facility';

export class OrderSimpleMapper implements EntitySimpleMapper<Order, OrderS, OrderPG, OrderDTS> {
  public static domainToSimple(domainOrder: Order): OrderS {
    const orderS = new OrderS(
      domainOrder.id,
      domainOrder.deliverAt,
      domainOrder.status,
      domainOrder.orderFoods,
      domainOrder.facility,
      domainOrder.totalCost,
      domainOrder.archiveAddress,
      domainOrder.customerPhonenumber,
      domainOrder.customerName,
      domainOrder.paymentMethod,
      domainOrder.paymentStatus,
      domainOrder.tablewareQuantity,
    );
    return orderS;
  }

  domainToSimple(domainOrder: Order): OrderS {
    return OrderSimpleMapper.domainToSimple(domainOrder);
  }

  public static dbToSimple(dbOrder: OrderPG): OrderS {
    if (!dbOrder.orderFoods) {
      throw new DatabaseError('Order data corrupt: orderFoods is missing check include clause');
    }
    if (!dbOrder.facility) {
      throw new DatabaseError('Order data corrupt: facility is missing check include clause');
    }

    const orderFoods = dbOrder.orderFoods.map(dbOrderFood => OrderFoodMapper.dbToDomain(dbOrderFood));
    const facility = FacilitySimpleMapper.dbToSimple(dbOrder.facility);

    const orderS = new OrderS(
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
      dbOrder.tablewareQuantity
    );

    return orderS;
  }

  dbToSimple(dbOrder: OrderPG): OrderS {
    return OrderSimpleMapper.dbToSimple(dbOrder);
  }

  public static dtsToSimple(orderDTS: OrderDTS): OrderS {

    const orderFoods = orderDTS.orderFoods.map(orderFoodDTS => OrderFoodMapper.dtToDomain(orderFoodDTS));
    const facility = FacilitySimpleMapper.dtsToSimple(orderDTS.facility);

    const orderS = new OrderS(
      orderDTS.id,
      new Date(orderDTS.deliverAt),
      orderDTS.status,
      orderFoods,
      facility,
      orderDTS.totalCost,
      orderDTS.archiveAddress,
      orderDTS.customerPhonenumber,
      orderDTS.customerName,
      orderDTS.paymentMethod,
      orderDTS.paymentStatus,
      orderDTS.tablewareQuantity
    );
    return orderS;
  }

  dtsToSimple(orderDTS: OrderDTS): OrderS {
    return OrderSimpleMapper.dtsToSimple(orderDTS);
  }

  public static simpleToDTS(orderS: OrderS): OrderDTS {

    const orderFoodsDTS = orderS.orderFoods.map(orderFood => OrderFoodMapper.domainToDT(orderFood));
    const facilityDTS = FacilitySimpleMapper.simpleToDTS(orderS.facility);

    const orderDTS: OrderDTS = {
      id: orderS.id,
      deliverAt: orderS.deliverAt.toISOString(),
      status: orderS.status,
      orderFoods: orderFoodsDTS,
      facility: facilityDTS,
      totalCost: orderS.totalCost,
      archiveAddress: orderS.archiveAddress,
      customerPhonenumber: orderS.customerPhonenumber,
      customerName: orderS.customerName,
      paymentMethod: orderS.paymentMethod,
      paymentStatus: orderS.paymentStatus,
      tablewareQuantity: orderS.tablewareQuantity
    };
    return orderDTS;
  }

  simpleToDTS(orderS: OrderS): OrderDTS {
    return OrderSimpleMapper.simpleToDTS(orderS);
  }
}