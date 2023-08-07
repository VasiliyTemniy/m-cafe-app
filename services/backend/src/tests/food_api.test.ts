import { EditFoodBody, EditFoodTypeBody, NewFoodBody, NewFoodTypeBody, timestampsKeys } from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { Food, FoodType, LocString, User } from "../models";
import config from "../utils/config";
import { connectToDatabase } from "../utils/db";
import { validAdminInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { initFoods, initFoodTypes } from "./food_api_helper";
import { validUserInDB } from "./users_api_helper";



await connectToDatabase();
const api = supertest(app);


describe('Food type requests tests', () => {

  let tokenCookie: string;
  let foodTypes: FoodType[];

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
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    await FoodType.destroy({ where: {} });
    await LocString.destroy({ where: {} });

    foodTypes = await initFoodTypes();
  });

  it('Food type get routes work without authorization', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodTypeInDB = await FoodType.findByPk(foodTypes[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: LocString,
          as: 'nameLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        },
        {
          model: LocString,
          as: 'descriptionLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        }
      ]
    });

    expect(response1.body.nameLoc.id).to.equal(foodTypeInDB?.nameLoc?.id);
    expect(response1.body.nameLoc.ruString).to.equal(foodTypeInDB?.nameLoc?.ruString);
    expect(response1.body.descriptionLoc.id).to.equal(foodTypeInDB?.descriptionLoc?.id);
    expect(response1.body.descriptionLoc.ruString).to.equal(foodTypeInDB?.descriptionLoc?.ruString);

    const response2 = await api
      .get(`${apiBaseUrl}/foodtype`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(foodTypes.length);

  });

  it('Food type post, put, delete routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/foodtype`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('A valid new food type can be added by admin', async () => {

    const newFoodType: NewFoodTypeBody = {
      nameLoc: {
        ruString: 'Пицца'
      },
      descriptionLoc: {
        ruString: 'Круглая выпечка с открытой начинкой'
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/foodtype`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFoodType)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.ruString).to.equal(newFoodType.nameLoc.ruString);
    expect(response.body.descriptionLoc.ruString).to.equal(newFoodType.descriptionLoc.ruString);

  });

  it('Food type can be updated by admin', async () => {

    const updFoodType: EditFoodTypeBody = {
      nameLoc: {
        id: foodTypes[0].nameLocId,
        ruString: 'Пицца',
        enString: 'Pizza',
        altString: 'Donnerwetter'
      },
      descriptionLoc: {
        id: foodTypes[0].descriptionLocId,
        ruString: 'Круглая выпечка с открытой начинкой',
        enString: 'Pizza-pizza pie',
        altString: 'vayvah'
      }
    };

    const response = await api
      .put(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFoodType)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.ruString).to.equal(updFoodType.nameLoc.ruString);
    expect(response.body.descriptionLoc.ruString).to.equal(updFoodType.descriptionLoc.ruString);

  });

  it('Food type can be deleted by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});


describe('Food requests tests', () => {

  let tokenCookie: string;
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
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    foods = await initFoods();
  });

  it('Food get routes work without authorization', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodInDB = await Food.findByPk(foods[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: LocString,
          as: 'nameLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        },
        {
          model: LocString,
          as: 'descriptionLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        },
        {
          model: FoodType,
          as: 'foodType',
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            {
              model: LocString,
              as: 'nameLoc',
              attributes: {
                exclude: [...timestampsKeys]
              }
            },
            {
              model: LocString,
              as: 'descriptionLoc',
              attributes: {
                exclude: [...timestampsKeys]
              }
            },
          ]
        }
      ]
    });

    expect(response1.body.nameLoc.id).to.equal(foodInDB?.nameLoc?.id);
    expect(response1.body.nameLoc.ruString).to.equal(foodInDB?.nameLoc?.ruString);
    expect(response1.body.descriptionLoc.id).to.equal(foodInDB?.descriptionLoc?.id);
    expect(response1.body.descriptionLoc.ruString).to.equal(foodInDB?.descriptionLoc?.ruString);
    expect(response1.body.price).to.equal(foodInDB?.price);

    const response2 = await api
      .get(`${apiBaseUrl}/food`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(foods.length);

  });

  it('Food post, put, delete routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/food`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('A valid new food can be added', async () => {

    const newFood: NewFoodBody = {
      nameLoc: {
        ruString: 'Маргарита'
      },
      descriptionLoc: {
        ruString: 'Супергут'
      },
      price: 100500,
      foodTypeId: foods[Math.round(Math.random() * foods.length - 1)].foodTypeId
    };

    const response = await api
      .post(`${apiBaseUrl}/food`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.ruString).to.equal(newFood.nameLoc.ruString);
    expect(response.body.descriptionLoc.ruString).to.equal(newFood.descriptionLoc.ruString);

  });

  it('Food can be updated', async () => {

    const updFoodType: EditFoodBody = {
      nameLoc: {
        id: foods[0].nameLocId,
        ruString: 'Маргарита'
      },
      descriptionLoc: {
        id: foods[0].descriptionLocId,
        ruString: 'Супергут'
      },
      price: 100500,
      foodTypeId: foods[Math.round(Math.random() * foods.length - 1)].foodTypeId
    };

    const response = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFoodType)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.ruString).to.equal(updFoodType.nameLoc.ruString);
    expect(response.body.descriptionLoc.ruString).to.equal(updFoodType.descriptionLoc.ruString);

  });

  it('Food can be deleted', async () => {

    await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});