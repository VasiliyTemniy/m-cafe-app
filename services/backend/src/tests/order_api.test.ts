import type {
  NewOrderBody,
  NewOrderFood,
  EditOrderBody,
  OrderFoodDT,
  EditOrderStatusBody,
  OrderDTS,
  OrderDT
} from '@m-cafe-app/utils';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import {
  connectToDatabase,
  Address,
  Facility,
  LocString,
  User,
  Food,
  Order,
  OrderFood,
  FacilityManager
} from '@m-cafe-app/db';
import config from '../utils/config';
import { validAdminInDB, validManagerInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { initialUsers, initialUsersPassword, validAddresses, validUserInDB } from './user_api_helper';
import { initFacilities } from './facility_api_helper';
import { initFoods } from './food_api_helper';
import { includeNameLocNoTimestamps } from '../utils/sequelizeHelpers';
import { initOrders } from './order_api_helper';



await connectToDatabase();
const api = supertest(app);


describe('Order requests tests', () => {

  let adminTokenCookie: string;
  let managerTokenCookie: string;
  let userTokenCookie: string;
  let facilities: Facility[];
  let foods: Food[];
  let initialOrders: OrderDT[];
  let validUserInDBID: number;
  let validManagerInDBID: number;

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
    const manager = await User.create(validManagerInDB.dbEntry);
    const user = await User.create(validUserInDB.dbEntry);
    await User.bulkCreate(initialUsers);
    await Address.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Order.destroy({ where: {} });
    adminTokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;
    managerTokenCookie = await initLogin(validManagerInDB.dbEntry, validManagerInDB.password, api, 201, userAgent) as string;
    userTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    validManagerInDBID = manager.id;
    validUserInDBID = user.id;

    // on delete - cascade to facility, etc
    await LocString.destroy({ where: {} });

    facilities = await initFacilities();
    foods = await initFoods();
    initialOrders = await initOrders(api, facilities, foods);
  });

  it('Order POST / creates a new order. Can be used without authorization', async () => {

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
      .set('Cookie', [userTokenCookie])
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

  it('Order PUT /:id updates an order. Can be used by a manager or admin', async () => {

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
      .set('Cookie', [managerTokenCookie])
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

  it('Order PUT /:id/status updates order status. Can be used by a manager or admin', async () => {

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

    const newStatus: EditOrderStatusBody = {
      status: 'cooking'
    };

    const response2 = await api
      .put(`${apiBaseUrl}/order/${response1.body.id}/status`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .send(newStatus)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.status).to.equal(newStatus.status);

  });

  it('Order GET /:id request gives detailed info about order. Can be used by exact same user that made new order or by \
this facility`s manager or admin. Other facility`s managers also cannot get this data. No anonymous requests handled here', async () => {

    const deliverAt = new Date(Date.now() + 1000 * 60 * 60);

    const orderFoods = [] as NewOrderFood[];

    const ordersFacilityId = facilities[Math.round(Math.random() * (facilities.length - 1))].id;

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
      facilityId: ordersFacilityId,
      newAddress: validAddresses[0],
      orderFoods
    };

    const response1 = await api
      .post(`${apiBaseUrl}/order`)
      .set('Cookie', [userTokenCookie])
      .set('User-Agent', userAgent)
      .send(validOrder)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response2 = await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('Cookie', [userTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    
    for (const key in response1.body) {
      if (key === 'orderFoods' || key === 'facility') continue;
      expect(response1.body[key]).to.equal(response2.body[key]);
    }

    const resGetOrderFoods = response2.body.orderFoods as OrderFoodDT[];

    for (const orderFood of response1.body.orderFoods as OrderFoodDT[]) {
      const resOrderFood = resGetOrderFoods.find(resOrderFoodItem => resOrderFoodItem.id === orderFood.id);
      expect(resOrderFood?.amount).to.equal(orderFood.amount);
      expect(resOrderFood?.archiveFoodName).to.equal(orderFood.archiveFoodName);
      expect(resOrderFood?.archivePrice).to.equal(orderFood.archivePrice);
    }

    const response3 = await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('AuthorizationError');
    expect(response3.body.error.message).to.equal('Authorization required');

    
    const anotherUserTokenCookie = await initLogin(initialUsers[0], initialUsersPassword, api, 201, userAgent) as string;

    const response4 = await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('Cookie', [anotherUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');
    expect(response4.body.error.message).to.equal('You have no rights to see this order details');


    const response5 = await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response5.body.error.name).to.equal('ProhibitedError');
    expect(response5.body.error.message).to.equal('You are not a manager of this orders facility');


    // Manager moves to the facility that this order was made for
    await FacilityManager.create({
      userId: validManagerInDBID,
      facilityId: ordersFacilityId
    });

    await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)  // Just check that data passes
      .expect('Content-Type', /application\/json/);

    await api
      .get(`${apiBaseUrl}/order/${response1.body.id}`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)  // Just check that data passes
      .expect('Content-Type', /application\/json/);

  });

  it('Order GET /user/:userId request gives info about order without details. Can be used by user, manager or admin', async () => {

    await Order.destroy({ where: { userId: validUserInDBID }});

    const userOrders = await initOrders(api, facilities, foods, userTokenCookie);

    const response1 = await api
      .get(`${apiBaseUrl}/order/user/${validUserInDBID}`)
      .set('Cookie', [userTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resOrders = response1.body as OrderDTS[];

    for (const userOrder of userOrders) {
      const resOrder = resOrders.find(order => order.id === userOrder.id);
      expect(userOrder.deliverAt).to.equal(resOrder?.deliverAt);
      expect(userOrder.archiveAddress).to.equal(resOrder?.archiveAddress);
      expect(userOrder.customerName).to.equal(resOrder?.customerName);
      expect(userOrder.customerPhonenumber).to.equal(resOrder?.customerPhonenumber);
      expect(userOrder.facility.id).to.equal(resOrder?.facilityId);
      expect(userOrder.totalCost).to.equal(resOrder?.totalCost);
    }

    await api
      .get(`${apiBaseUrl}/order/user/${validUserInDBID}`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)  // Just check that data passes
      .expect('Content-Type', /application\/json/);

    await api
      .get(`${apiBaseUrl}/order/user/${validUserInDBID}`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)  // Just check that data passes
      .expect('Content-Type', /application\/json/);

  });

  it('Order GET / request gives info about all orders without details. Can be used by admin \
or manager with req query facilityid', async () => {
  
    await FacilityManager.destroy({ where: { userId: validManagerInDBID } });

    await FacilityManager.create({
      userId: validManagerInDBID,
      facilityId: facilities[0].id
    });

    const response1 = await api
      .get(`${apiBaseUrl}/order/?limit=100`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const res1Orders = response1.body as OrderDTS[];

    for (const initialOrder of initialOrders) {
      const resOrder = res1Orders.find(order => order.id === initialOrder.id);
      expect(initialOrder.deliverAt).to.equal(resOrder?.deliverAt);
      expect(initialOrder.archiveAddress).to.equal(resOrder?.archiveAddress);
      expect(initialOrder.customerName).to.equal(resOrder?.customerName);
      expect(initialOrder.customerPhonenumber).to.equal(resOrder?.customerPhonenumber);
      expect(initialOrder.facility.id).to.equal(resOrder?.facilityId);
      expect(initialOrder.totalCost).to.equal(resOrder?.totalCost);      
    }

    // Manager asks to get all info without specifying facilityid
    const response2 = await api
      .get(`${apiBaseUrl}/order/?limit=100`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');
    expect(response2.body.error.message).to.equal('You have to be an admin to see all orders');
    

    // Manager asks to get all info while specifying facilityid which he is a manager of
    const response3 = await api
      .get(`${apiBaseUrl}/order/?limit=100&facilityid=${facilities[0].id}`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const res3Orders = response3.body as OrderDTS[];

    for (const initialOrder of initialOrders) {
      const resOrder = res3Orders.find(order => order.id === initialOrder.id);

      if (initialOrder.facility.id !== facilities[0].id) {
        expect(resOrder).to.not.exist;
        continue;
      }

      expect(initialOrder.deliverAt).to.equal(resOrder?.deliverAt);
      expect(initialOrder.archiveAddress).to.equal(resOrder?.archiveAddress);
      expect(initialOrder.customerName).to.equal(resOrder?.customerName);
      expect(initialOrder.customerPhonenumber).to.equal(resOrder?.customerPhonenumber);
      expect(initialOrder.facility.id).to.equal(resOrder?.facilityId);
      expect(initialOrder.totalCost).to.equal(resOrder?.totalCost);      
    }
  
  });

});