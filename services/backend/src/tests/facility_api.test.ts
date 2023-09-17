import {
  EditFacilityBody,
  EditStock,
  isStockDT,
  NewAddressBody,
  NewFacilityBody,
  NewStock,
  StockDT,
  UserDT
} from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import {
  connectToDatabase,
  Address,
  Facility,
  FacilityManager,
  LocString,
  User,
  UserAddress
} from '@m-cafe-app/db';
import config from "../utils/config";
import { validAdminInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { initialUsers, initialUsersPassword, validUserInDB } from "./user_api_helper";
import {
  includeNameDescriptionLocNoTimestamps
} from "../utils/sequelizeHelpers";
import { initFacilities } from "./facility_api_helper";
import { initIngredients } from "./ingredient_api_helper";



await connectToDatabase();
const api = supertest(app);


describe('Facility requests tests', () => {

  let tokenCookie: string;
  let facilities: Facility[];

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
    await User.create(validUserInDB.dbEntry);
    await User.bulkCreate(initialUsers);
    await Address.destroy({ where: {} });
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    // on delete - cascade to facility, etc
    await LocString.destroy({ where: {} });

    facilities = await initFacilities();
  });

  it('Facility GET(all) route work without authorization', async () => {

    const response = await api
      .get(`${apiBaseUrl}/facility`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).to.be.lengthOf(facilities.length);

    for (const facility of response.body) {
      const indexToFind = facilities.findIndex(facilityInDB => facilityInDB.id === facility.id);
      expect(indexToFind).to.be.above(-1);
    }

  });

  it('Facility POST, PUT, DELETE routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/facility/${facilities[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/facility/${facilities[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/facility`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/facility/${facilities[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('Facility POST / adds new facility, can be used by admin', async () => {

    const newFacility: NewFacilityBody = {
      nameLoc: {
        mainStr: 'Улыбка Дяди Вани'
      },
      descriptionLoc: {
        mainStr: 'Самая весёлая улыбка из Ваших кошмаров!'
      },
      address: {
        city: 'Черноголовка',
        street: 'Ленина'
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/facility`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFacility)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.mainStr).to.equal(newFacility.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(newFacility.descriptionLoc.mainStr);
    expect(response.body.address.city).to.equal(newFacility.address.city);
    expect(response.body.address.street).to.equal(newFacility.address.street);
  });

  it('Facility PUT /:id updates facility data, can be used by admin', async () => {

    const updFacility: EditFacilityBody = {
      nameLoc: {
        id: facilities[0].nameLocId,
        mainStr: 'Колобесъ и ко',
      },
      descriptionLoc: {
        id: facilities[0].descriptionLocId,
        mainStr: 'МЫ ПЕРЕЕХАЛИ! ВСТРИЧАЙТИ',
      },
      address: {
        city: 'Урюпинск',
        street: 'Ленина'  // same as one of user's addresses to check deletion / not deletion
      }
    };

    const response = await api
      .put(`${apiBaseUrl}/facility/${facilities[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFacility)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFacilityInDB = await Facility.findByPk(facilities[0].id, {
      include: [
        {
          model: Address,
          as: 'address'
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response.body.nameLoc.mainStr).to.equal(updFacility.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(updFacility.descriptionLoc.mainStr);
    expect(response.body.address.city).to.equal(updFacility.address.city);
    expect(response.body.address.street).to.equal(updFacility.address.street);

    expect(updFacilityInDB?.nameLoc?.mainStr).to.equal(updFacility.nameLoc.mainStr);
    expect(updFacilityInDB?.descriptionLoc?.mainStr).to.equal(updFacility.descriptionLoc.mainStr);
    expect(updFacilityInDB?.address?.city).to.equal(updFacility.address.city);
    expect(updFacilityInDB?.address?.street).to.equal(updFacility.address.street);

  });

  it('If facility address is changed and it is not used by anyone, it gets deleted. If it is used, it does not get deleted', async () => {

    const doubleUsedAddress: NewAddressBody = {
      city: 'Младокрендельск',
      street: 'Ленина'
    };

    const userTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    // User adds doubleUserAddress
    await api
      .post(`${apiBaseUrl}/user/address`)
      .set("Cookie", [userTokenCookie])
      .set('User-Agent', userAgent)
      .send(doubleUsedAddress)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newFacility: NewFacilityBody = {
      nameLoc: {
        mainStr: 'Младокрендельский бублокомбинат',
      },
      descriptionLoc: {
        mainStr: 'Бубельные бублики от младокрендельского комбината №1',
      },
      address: doubleUsedAddress
    };

    // Facility with doubleUserAddress gets created
    const response = await api
      .post(`${apiBaseUrl}/facility`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFacility)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Get DB data to extract ids
    const newFacilityData = await Facility.findByPk(response.body.id as number);
    if (!newFacilityData) return expect(false).to.equal(true);

    const addressExists1 = await Address.findOne({ where: { ...doubleUsedAddress } });
    expect(addressExists1).to.exist;

    const newFacilityAddress: NewAddressBody = {
      city: 'Новообгажено',
      street: 'Ленина'
    };

    // Facility moves
    const updFacility: EditFacilityBody = {
      nameLoc: {
        id: newFacilityData.nameLocId,
        mainStr: 'Колобесъ и ко',
      },
      descriptionLoc: {
        id: newFacilityData.descriptionLocId,
        mainStr: 'МЫ ПЕРЕЕХАЛИ! ВСТРИЧАЙТИ',
      },
      address: newFacilityAddress
    };

    await api
      .put(`${apiBaseUrl}/facility/${newFacilityData.id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFacility)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const addressExists2 = await Address.findOne({ where: { ...doubleUsedAddress } });
    expect(addressExists2).to.exist;

    const userHasAddress = await UserAddress.findOne({ where: { addressId: addressExists2!.id } });
    expect(userHasAddress).to.exist;

    // User moves out
    await api
      .delete(`${apiBaseUrl}/user/address/${addressExists2!.id}`)
      .set("Cookie", [userTokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

    // Address deleted
    const addressExists3 = await Address.findOne({ where: { ...doubleUsedAddress } });
    expect(addressExists3).to.not.exist;

    // Facility moves back
    const updFacility2: EditFacilityBody = {
      nameLoc: {
        id: newFacilityData.nameLocId,
        mainStr: 'Колобесъ и ко',
      },
      descriptionLoc: {
        id: newFacilityData.descriptionLocId,
        mainStr: 'МЫ ПЕРЕЕХАЛИ! ВСТРИЧАЙТИ',
      },
      address: doubleUsedAddress
    };
    
    await api
      .put(`${apiBaseUrl}/facility/${newFacilityData.id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFacility2)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const addressExists4 = await Address.findOne({ where: { ...doubleUsedAddress } });
    expect(addressExists4).to.exist;

    // Facility moves again
    const updFacility3: EditFacilityBody = {
      nameLoc: {
        id: newFacilityData.nameLocId,
        mainStr: 'Колобесъ и ко',
      },
      descriptionLoc: {
        id: newFacilityData.descriptionLocId,
        mainStr: 'МЫ ПЕРЕЕХАЛИ! ВСТРИЧАЙТИ',
      },
      address: newFacilityAddress
    };
        
    await api
      .put(`${apiBaseUrl}/facility/${newFacilityData.id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFacility3)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    // Facility moved, user does not live there - address deleted
    const addressExists5 = await Address.findOne({ where: { ...doubleUsedAddress } });
    expect(addressExists5).to.not.exist;

    // User moves to new facility location
    await api
      .post(`${apiBaseUrl}/user/address`)
      .set("Cookie", [userTokenCookie])
      .set('User-Agent', userAgent)
      .send(newFacilityAddress)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const addressExists6 = await Address.findOne({ where: { ...newFacilityAddress } });
    expect(addressExists6).to.exist;

    // User moves out again, but the address stays
    await api
      .delete(`${apiBaseUrl}/user/address/${addressExists6!.id}`)
      .set("Cookie", [userTokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

    const addressExists7 = await Address.findOne({ where: { ...newFacilityAddress } });
    expect(addressExists7).to.exist;

  });

  it('Facility GET /:id/managers route responses with all facility info including managers list as User DT objects', async () => {

    const usersInDB = await User.scope('user').findAll();

    const userToBecomeManager = usersInDB[Math.round(Math.random() * (usersInDB.length - 1))];

    userToBecomeManager.rights = 'manager';

    await userToBecomeManager.save();

    await FacilityManager.create({ facilityId: facilities[0].id, userId: userToBecomeManager.id });

    const response = await api
      .get(`${apiBaseUrl}/facility/${facilities[0].id}/managers`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.managers).to.exist;

    const managers = response.body.managers as Array<UserDT>;
    const managerIds = managers.map(manager => manager.id);

    expect(managerIds.includes(userToBecomeManager.id)).to.equal(true);

  });

  it('Facility PUT /:id/stocks route works and can be used either by current facility manager or by any admin. \
New stocks get added, other stocks get updated', async () => {

    const usersInDB = await User.scope('user').findAll();

    const userToBecomeManager = usersInDB[Math.round(Math.random() * (usersInDB.length - 1))];

    userToBecomeManager.rights = 'manager';

    await userToBecomeManager.save();

    await FacilityManager.findOrCreate({ where: { facilityId: facilities[0].id, userId: userToBecomeManager.id } });

    const managerTokenCookie = await initLogin(userToBecomeManager.dataValues, initialUsersPassword, api, 201, userAgent) as string;

    const ingredients = await initIngredients();

    // Manager wants to add stocks
    const stocksToSend: NewStock[] = [];

    for (const ingredient of ingredients) {
      const stock: NewStock = {
        ingredientId: ingredient.id,
        amount: Math.round(Math.random() * 1000)
      };
      stocksToSend.push(stock);
    }

    // Manager adds stocks
    const response = await api
      .put(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [managerTokenCookie])
      .set('User-Agent', userAgent)
      .send({ stocksUpdate: stocksToSend })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resStocks = response.body as Array<StockDT>;

    for (const resStock of resStocks) {
      const sentStock = stocksToSend.find(stock => stock.ingredientId === resStock.ingredientId);
      expect(sentStock).to.exist;
      expect(sentStock?.amount).to.equal(resStock.amount);
    }

    // Admin wants to update stocks
    const stocksToUpdate: EditStock[] = [];

    for (const resStock of resStocks) {
      resStock.amount = Math.round(Math.random() * 1000);
      stocksToUpdate.push(resStock as EditStock);
    }

    // Admin updates stocks
    const response2 = await api
      .put(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ stocksUpdate: stocksToUpdate })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    const resStocks2 = response2.body as Array<StockDT>;
  
    for (const resStock of resStocks2) {
      const sentStock = stocksToUpdate.find(stock => stock.ingredientId === resStock.ingredientId);
      expect(sentStock).to.exist;
      expect(sentStock?.amount).to.equal(resStock.amount);
    }

  });

  it('Facility PUT /:id/stocks route cannot be used by other facility`s manager', async () => {
  
    // manager from previous test must have moved to another scope
    const usersInDB = await User.scope('user').findAll();
  
    const userToBecomeManager = usersInDB[Math.round(Math.random() * (usersInDB.length - 1))];
  
    userToBecomeManager.rights = 'manager';
  
    await userToBecomeManager.save();
  
    // Manager of facility number 1
    await FacilityManager.findOrCreate({ where: { facilityId: facilities[1].id, userId: userToBecomeManager.id } });
  
    const managerTokenCookie = await initLogin(userToBecomeManager.dataValues, initialUsersPassword, api, 201, userAgent) as string;
  
    const ingredients = await initIngredients();
  
    const stocksToSend: NewStock[] = [];
  
    for (const ingredient of ingredients) {
      const stock: NewStock = {
        ingredientId: ingredient.id,
        amount: Math.round(Math.random() * 1000)
      };
      stocksToSend.push(stock);
    }
  
    // Manager of facility number 1 wants to add stocks to facility 0
    const response = await api
      .put(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [managerTokenCookie])
      .set('User-Agent', userAgent)
      .send({ stocksUpdate: stocksToSend })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('You are not a manager of this facility. Contact admins to solve this problem');
  
  });

  it('Facility GET /:id/stocks route gives facility info including stocks. \
Can be used either by current facility manager or by any admin', async () => {

    const usersInDB = await User.scope('user').findAll();

    const userToBecomeManager = usersInDB[Math.round(Math.random() * (usersInDB.length - 1))];

    userToBecomeManager.rights = 'manager';

    await userToBecomeManager.save();

    await FacilityManager.findOrCreate({ where: { facilityId: facilities[0].id, userId: userToBecomeManager.id } });

    const managerTokenCookie = await initLogin(userToBecomeManager.dataValues, initialUsersPassword, api, 201, userAgent) as string;

    const response1 = await api
      .get(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.stocks).to.exist;

    const resStocks = response1.body.stocks as StockDT[];
    for (const resStock of resStocks) {
      if (!isStockDT(resStock)) expect(true).to.equal(false);
    }

    const response2 = await api
      .get(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.stocks).to.exist;


    // Manager moves to facility number 2
    await FacilityManager.destroy({ where: { facilityId: facilities[0].id, userId: userToBecomeManager.id } });
    await FacilityManager.findOrCreate({ where: { facilityId: facilities[1].id, userId: userToBecomeManager.id } });

    const response3 = await api
      .get(`${apiBaseUrl}/facility/${facilities[0].id}/stocks`)
      .set("Cookie", [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');
    expect(response3.body.error.message).to.equal('You are not a manager of this facility. Contact admins to solve this problem');

  });

  it('Facility POST /:id/managers adds faciliry manager, can be used by admin', async () => {

    const usersInDB = await User.scope('user').findAll();

    await api
      .post(`${apiBaseUrl}/facility/${facilities[0].id}/managers`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ userId: usersInDB[0].id })
      .expect(201);

    const facilityManager = await FacilityManager.findOne({ where: { userId: usersInDB[0].id } });

    expect(facilityManager).to.exist;

    const userManager = await User.findByPk(facilityManager!.userId);

    expect(userManager!.rights).to.equal('manager');

  });

  it('Facility DELETE /:id/managers/:userId deletes facility manager, can be used by admin', async () => {

    const facilityManagersInDB = await FacilityManager.findAll({ where: { facilityId: facilities[0].id } });

    await api
      .delete(`${apiBaseUrl}/facility/${facilities[0].id}/managers/${facilityManagersInDB[0].userId}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

    const userExManager = await User.findOne({ where: { id: facilityManagersInDB[0].userId } });

    expect(userExManager!.rights).to.equal('user');

    const deletedManager = await FacilityManager.findOne({ where: { facilityId: facilities[0].id, userId: facilityManagersInDB[0].userId } });

    expect(deletedManager).to.not.exist;

  });

  it('Facility DELETE /:id deletes facility data, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/facility/${facilities[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});