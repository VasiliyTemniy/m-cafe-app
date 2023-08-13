import { NewOrderBody, NewOrderFood, EditOrderBody, OrderFoodDT } from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { Address, Facility, LocString, User, Food, Order, OrderFood } from "../models";
import config from "../utils/config";
import { connectToDatabase } from "../utils/db";
import { validAdminInDB, validManagerInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { initialUsers, validAddresses, validUserInDB } from "./users_api_helper";
import { initFacilities } from "./facility_api_helper";
import { initFoods } from "./food_api_helper";
import { includeNameLocNoTimestamps } from "../utils/sequelizeHelpers";



await connectToDatabase();
const api = supertest(app);


describe('Order requests tests', () => {

  // let adminTokenCookie: string;
  let managerTokenCookie: string;
  let userTokenCookie: string;
  let facilities: Facility[];
  let foods: Food[];

  before(async () => {
    await User.scope('all').destroy({
      force: true,
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    await User.create(validAdminInDB.dbEntry);
    await User.create(validManagerInDB.dbEntry);
    await User.create(validUserInDB.dbEntry);
    await User.bulkCreate(initialUsers);
    await Address.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Order.destroy({ where: {} });
    // adminTokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;
    managerTokenCookie = await initLogin(validManagerInDB.dbEntry, validManagerInDB.password, api, 201, userAgent) as string;
    userTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    // on delete - cascade to facility, etc
    await LocString.destroy({ where: {} });

    facilities = await initFacilities();
    foods = await initFoods();
  });

  it('Order POST creates a new order. Can be used without authorization', async () => {

    const deliverAt = new Date(Date.now() + 1000 * 60 * 60);

    const orderFoods = [] as NewOrderFood[];

    for (const food of foods) {
      const orderFood: NewOrderFood = {
        foodId: food.id,
        amount: Math.round(Math.random() * 10)
      };
      orderFoods.push(orderFood);
    }

    const validOrder: NewOrderBody = {
      deliverAt: deliverAt.toISOString(),
      customerName: 'Васисуалий',
      customerPhonenumber: '88000000203',
      facilityId: facilities[0].id,
      newAddress: validAddresses[0],
      orderFoods
    };

    const response1 = await api
      .post(`${apiBaseUrl}/order`)
      .set('User-Agent', userAgent)
      .send(validOrder)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const orderInDB1 = await Order.findOne({
      where: {
        customerName: validOrder.customerName,
        customerPhonenumber: validOrder.customerPhonenumber
      },
      include: [
        {
          model: OrderFood,
          as: 'orderFoods'
        },
        {
          model: Facility,
          as: 'facility',
          include: [
            includeNameLocNoTimestamps
          ]
        }
      ]
    });

    expect(response1.body.orderFoods).to.be.lengthOf(foods.length);
    expect(response1.body.status).to.equal('accepted');
    expect(response1.body.customerName).to.equal(validOrder.customerName);
    expect(response1.body.customerPhonenumber).to.equal(validOrder.customerPhonenumber);

    expect(response1.body.orderFoods).to.be.lengthOf(orderInDB1!.orderFoods!.length);
    expect(response1.body.status).to.equal(orderInDB1!.status);

    expect(response1.body.facility.nameLoc.mainStr).to.equal(orderInDB1!.facility!.nameLoc!.mainStr);

    expect(orderInDB1!.userId).to.not.exist;

    await api
      .post(`${apiBaseUrl}/order`)
      .set("Cookie", [userTokenCookie])
      .set('User-Agent', userAgent)
      .send({
        ...validOrder,
        customerName: validUserInDB.dbEntry.name
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const orderInDB2 = await Order.findOne({
      where: {
        customerName: validUserInDB.dbEntry.name,
        customerPhonenumber: validOrder.customerPhonenumber
      },
      include: [
        {
          model: OrderFood,
          as: 'orderFoods'
        },
        {
          model: Facility,
          as: 'facility',
          include: [
            includeNameLocNoTimestamps
          ]
        }
      ]
    });

    expect(orderInDB2!.userId).to.exist;

  });

  it('Order PUT updates an order. Can be used by a manager or admin', async () => {

    const deliverAt = new Date(Date.now() + 1000 * 60 * 60);

    const orderFoods = [] as NewOrderFood[];

    for (const food of foods) {
      const orderFood: NewOrderFood = {
        foodId: food.id,
        amount: Math.round(Math.random() * 10)
      };
      orderFoods.push(orderFood);
    }

    const validOrder: NewOrderBody = {
      deliverAt: deliverAt.toISOString(),
      customerName: 'Васисуалий',
      customerPhonenumber: '88000000203',
      facilityId: facilities[0].id,
      newAddress: validAddresses[0],
      orderFoods
    };

    const response1 = await api
      .post(`${apiBaseUrl}/order`)
      .set('User-Agent', userAgent)
      .send(validOrder)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const updDeliverAt = new Date(Date.now() + 1000 * 60 * 60);

    const updOrderFoods = [] as NewOrderFood[];
  
    for (const food of foods) {
      const orderFood: NewOrderFood = {
        foodId: food.id,
        amount: Math.round(Math.random() * 10)
      };
      updOrderFoods.push(orderFood);
    }
  
    const updValidOrder: EditOrderBody = {
      deliverAt: updDeliverAt.toISOString(),
      customerName: 'Васисуалий Иванович',
      customerPhonenumber: '88001500203',
      facilityId: facilities[1].id,
      newAddress: validAddresses[1],
      orderFoods: updOrderFoods
    };

    const response2 = await api
      .put(`${apiBaseUrl}/order/${response1.body.id}`)
      .set("Cookie", [managerTokenCookie])
      .set('User-Agent', userAgent)
      .send(updValidOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.orderFoods).to.be.lengthOf(foods.length);
    expect(response2.body.status).to.equal('accepted');
    expect(response2.body.customerName).to.equal(updValidOrder.customerName);
    expect(response2.body.customerPhonenumber).to.equal(updValidOrder.customerPhonenumber);

    const response2OrderFoods = response2.body.orderFoods as OrderFoodDT[];

    for (const updOrderFood of updOrderFoods) {
      const response2OrderFood = response2OrderFoods.find(orderFood => orderFood.food?.id === updOrderFood.foodId);
      expect(response2OrderFood?.amount).to.equal(updOrderFood.amount);
    }

  });

});