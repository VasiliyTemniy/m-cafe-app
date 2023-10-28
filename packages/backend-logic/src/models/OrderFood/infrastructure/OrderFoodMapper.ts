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
      dbOrderFood.id,
      dbOrderFood.orderId,
      dbOrderFood.amount,
      dbOrderFood.archivePrice,
      dbOrderFood.archiveFoodName,
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
      orderFoodDT.id,
      orderFoodDT.orderId,
      orderFoodDT.amount,
      orderFoodDT.archivePrice,
      orderFoodDT.archiveFoodName,
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
      id: domainOrderFood.id,
      orderId: domainOrderFood.orderId,
      amount: domainOrderFood.amount,
      archivePrice: domainOrderFood.archivePrice,
      archiveFoodName: domainOrderFood.archiveFoodName,
      food
    };
    return orderFoodDT;
  }

  domainToDT(domainOrderFood: OrderFood): OrderFoodDT {
    return OrderFoodMapper.domainToDT(domainOrderFood);
  }

}