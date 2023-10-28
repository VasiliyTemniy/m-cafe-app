import type { EntitySimpleMapper } from '../../../utils';
import type { OrderFood as OrderFoodPG } from '@m-cafe-app/db';
import { OrderFoodS, type OrderFood, type OrderFoodDTS } from '@m-cafe-app/models';
import { FoodSimpleMapper } from '../../Food';

export class OrderFoodSimpleMapper implements EntitySimpleMapper<OrderFood, OrderFoodS, OrderFoodPG, OrderFoodDTS> {
  public static domainToSimple(domainOrderFood: OrderFood): OrderFoodS {
    const orderFoodS = new OrderFoodS(
      domainOrderFood.id,
      domainOrderFood.amount,
      domainOrderFood.archivePrice,
      domainOrderFood.archiveFoodName,
      domainOrderFood.food
    );
    return orderFoodS;
  }

  domainToSimple(domainOrderFood: OrderFood): OrderFoodS {
    return OrderFoodSimpleMapper.domainToSimple(domainOrderFood);
  }

  public static dbToSimple(dbOrderFood: OrderFoodPG): OrderFoodS {
    const food = dbOrderFood.food
      ? FoodSimpleMapper.dbToSimple(dbOrderFood.food)
      : undefined;

    const orderFoodS = new OrderFoodS(
      dbOrderFood.id,
      dbOrderFood.amount,
      dbOrderFood.archivePrice,
      dbOrderFood.archiveFoodName,
      food
    );

    return orderFoodS;
  }

  dbToSimple(dbOrderFood: OrderFoodPG): OrderFoodS {
    return OrderFoodSimpleMapper.dbToSimple(dbOrderFood);
  }

  public static dtsToSimple(orderFoodDTS: OrderFoodDTS): OrderFoodS {
    const food = orderFoodDTS.food
      ? FoodSimpleMapper.dtsToSimple(orderFoodDTS.food)
      : undefined;

    const orderFoodS = new OrderFoodS(
      orderFoodDTS.id,
      orderFoodDTS.amount,
      orderFoodDTS.archivePrice,
      orderFoodDTS.archiveFoodName,
      food
    );
    return orderFoodS;
  }

  dtsToSimple(orderFoodDTS: OrderFoodDTS): OrderFoodS {
    return OrderFoodSimpleMapper.dtsToSimple(orderFoodDTS);
  }

  public static simpleToDTS(orderFoodS: OrderFoodS): OrderFoodDTS {
    const food = orderFoodS.food
      ? FoodSimpleMapper.simpleToDTS(orderFoodS.food)
      : undefined;

    const orderFoodDTS: OrderFoodDTS = {
      id: orderFoodS.id,
      amount: orderFoodS.amount,
      archivePrice: orderFoodS.archivePrice,
      archiveFoodName: orderFoodS.archiveFoodName,
      food
    };
    return orderFoodDTS;
  }

  simpleToDTS(orderFoodS: OrderFoodS): OrderFoodDTS {
    return OrderFoodSimpleMapper.simpleToDTS(orderFoodS);
  }
}