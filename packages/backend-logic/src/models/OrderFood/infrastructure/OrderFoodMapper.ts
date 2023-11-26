import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { OrderFoodDT } from '@m-cafe-app/models';
import { OrderFood } from '@m-cafe-app/models';
import { OrderFood as OrderFoodPG } from '@m-cafe-app/db';
import { FoodSimpleMapper } from '../../Food';


export class OrderFoodMapper implements EntityDBMapper<OrderFood, OrderFoodPG>, EntityDTMapper<OrderFood, OrderFoodDT> {

  public static dbToDomain(dbOrderFood: OrderFoodPG): OrderFood {
    const food = dbOrderFood.food
      ? FoodSimpleMapper.dbToSimple(dbOrderFood.food)
      : undefined;

    const domainOrderFood = new OrderFood(
      dbOrderFood.quantity,
      dbOrderFood.archivePrice,
      dbOrderFood.archiveFoodId,
      dbOrderFood.archiveFoodName,
      dbOrderFood.orderId,
      food
    );
    return domainOrderFood;
  }

  dbToDomain(dbOrderFood: OrderFoodPG): OrderFood {
    return OrderFoodMapper.dbToDomain(dbOrderFood);
  }

  public static dtToDomain(orderFoodDT: OrderFoodDT): OrderFood {
    const food = orderFoodDT.food
      ? FoodSimpleMapper.dtsToSimple(orderFoodDT.food)
      : undefined;

    const domainOrderFood = new OrderFood(
      orderFoodDT.quantity,
      orderFoodDT.archivePrice,
      orderFoodDT.archiveFoodId,
      orderFoodDT.archiveFoodName,
      orderFoodDT.orderId,
      food
    );
    return domainOrderFood;
  }
  
  dtToDomain(orderFoodDT: OrderFoodDT): OrderFood {
    return OrderFoodMapper.dtToDomain(orderFoodDT);
  }

  public static domainToDT(domainOrderFood: OrderFood): OrderFoodDT {
    const food = domainOrderFood.food
      ? FoodSimpleMapper.simpleToDTS(domainOrderFood.food)
      : undefined;

    const orderFoodDT: OrderFoodDT = {
      quantity: domainOrderFood.quantity,
      archivePrice: domainOrderFood.archivePrice,
      archiveFoodId: domainOrderFood.archiveFoodId,
      archiveFoodName: domainOrderFood.archiveFoodName,
      orderId: domainOrderFood.orderId,
      food
    };
    return orderFoodDT;
  }

  domainToDT(domainOrderFood: OrderFood): OrderFoodDT {
    return OrderFoodMapper.domainToDT(domainOrderFood);
  }

}