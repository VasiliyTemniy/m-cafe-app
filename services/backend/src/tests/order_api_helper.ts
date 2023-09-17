import { Facility, Food } from '@m-cafe-app/db';
import { maxNameLen, minNameLen } from '@m-cafe-app/shared-constants';
import { NewOrderBody, NewOrderFood, OrderDT } from '@m-cafe-app/utils';
import supertest from 'supertest';
import { userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { genCorrectName, genCorrectPhonenumber, validAddresses } from './user_api_helper';

export const initOrders = async (
  api: supertest.SuperTest<supertest.Test>,
  facilities: Facility[],
  foods: Food[],
  userTokenCookie?: string,
  ordersCount: number = 5,
  orderFoodsMax: number = 4
) => {

  const orders = [] as OrderDT[];

  for (let f = 0; f < facilities.length; f++) { //f - number of a facility in facilities array
    for (let i = 0; i < ordersCount; i++) {

      const deliverAt = new Date(Date.now() + 1000 * 60 * 60);

      const orderFoods = [] as NewOrderFood[];

      let j = 0;

      for (const food of foods) {
        const orderFood: NewOrderFood = {
          foodId: food.id,
          amount: Math.round(Math.random() * 10)
        };
        orderFoods.push(orderFood);

        j++;
        if (orderFoodsMax && j >= orderFoodsMax) break;
      }

      const validOrder: NewOrderBody = {
        deliverAt: deliverAt.toISOString(),
        customerName: genCorrectName(minNameLen, maxNameLen),
        customerPhonenumber: genCorrectPhonenumber(),
        facilityId: facilities[f].id,
        newAddress: validAddresses[0],  // For now delivery addresses are all the same for test
        orderFoods
      };

      const response = userTokenCookie
        ? await api
          .post(`${apiBaseUrl}/order`)
          .set("Cookie", [userTokenCookie])
          .set('User-Agent', userAgent)
          .send(validOrder)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        : await api
          .post(`${apiBaseUrl}/order`)
          .set('User-Agent', userAgent)
          .send(validOrder)
          .expect(201)
          .expect('Content-Type', /application\/json/);


      orders.push(response.body as OrderDT);

    }
  }

  return orders;
  
};