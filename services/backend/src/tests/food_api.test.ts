import { EditFoodBody, EditFoodTypeBody, FoodComponentDT, FoodDT, NewFoodBody, NewFoodTypeBody, NewPictureBody, PictureDT, timestampsKeys } from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { Food, FoodPicture, FoodType, LocString, Picture, User } from "../models";
import config from "../utils/config";
import { connectToDatabase } from "../utils/db";
import { validAdminInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { initFoods, initFoodTypes } from "./food_api_helper";
import { validUserInDB } from "./users_api_helper";
import {
  includeNameDescriptionLocNoTimestamps,
  includeNameDescriptionLocNoTimestampsSecondLayer
} from "../utils/sequelizeHelpers";
import { initFoodComponents } from "./foodComponents_api_helper";
import { initIngredients } from "./ingredient_api_helper";



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

    // on delete - cascade to foodtype, food, etc
    await LocString.destroy({ where: {} });

    foodTypes = await initFoodTypes();
  });

  it('Food type GET routes work without authorization', async () => {

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
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response1.body.nameLoc.id).to.equal(foodTypeInDB?.nameLoc?.id);
    expect(response1.body.nameLoc.mainStr).to.equal(foodTypeInDB?.nameLoc?.mainStr);
    expect(response1.body.descriptionLoc.id).to.equal(foodTypeInDB?.descriptionLoc?.id);
    expect(response1.body.descriptionLoc.mainStr).to.equal(foodTypeInDB?.descriptionLoc?.mainStr);

    const response2 = await api
      .get(`${apiBaseUrl}/foodtype`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(foodTypes.length);

  });

  it('Food type POST, PUT, DELETE routes require admin rights', async () => {

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

  it('Food type POST / adds new food type, can be used by admin', async () => {

    const newFoodType: NewFoodTypeBody = {
      nameLoc: {
        mainStr: 'Пицца'
      },
      descriptionLoc: {
        mainStr: 'Круглая выпечка с открытой начинкой'
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/foodtype`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFoodType)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.mainStr).to.equal(newFoodType.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(newFoodType.descriptionLoc.mainStr);

  });

  it('Food type PUT /:id updates food type data, can be used by admin', async () => {

    const updFoodType: EditFoodTypeBody = {
      nameLoc: {
        id: foodTypes[0].nameLocId,
        mainStr: 'Пицца',
        secStr: 'Pizza',
        altStr: 'Donnerwetter'
      },
      descriptionLoc: {
        id: foodTypes[0].descriptionLocId,
        mainStr: 'Круглая выпечка с открытой начинкой',
        secStr: 'Pizza-pizza pie',
        altStr: 'vayvah'
      }
    };

    const response = await api
      .put(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFoodType)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFoodTypeInDB = await FoodType.findByPk(foodTypes[0].id, {
      include: [
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response.body.nameLoc.mainStr).to.equal(updFoodType.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(updFoodType.descriptionLoc.mainStr);

    expect(updFoodTypeInDB?.nameLoc?.mainStr).to.equal(updFoodType.nameLoc.mainStr);
    expect(updFoodTypeInDB?.descriptionLoc?.mainStr).to.equal(updFoodType.descriptionLoc.mainStr);

  });

  it('Food type DELETE /:id deletes a food type, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

  it('Food type GET / path accepts withfoodonly query key (only 0 as false or > 0 numeric as true)', async () => {

    // on delete - cascade to foodtype, food, etc
    await LocString.destroy({ where: {} });

    await initFoods(2);

    const foodTypesInDB = await FoodType.findAll({
      include: [
        {
          model: Food,
          as: 'foodTypeFoods'
        }
      ]
    });

    const response = await api
      .get(`${apiBaseUrl}/foodtype/?withfoodonly=${1}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    for (const foodTypeInRes of response.body) {
      expect(
        foodTypesInDB
          .find(foodTypeInDB => foodTypeInDB.id === foodTypeInRes.id)
          ?.foodTypeFoods
          ?.length
      ).to.be.above(0);
    }

  });

  it('Food type GET / path does not accept withfoodonly query key if it is not numeric', async () => {

    const response = await api
      .get(`${apiBaseUrl}/foodtype/?withfoodonly=${'some_malicious_query?hope_it_wont_get_through!'}`)
      .set('User-Agent', userAgent)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('RequestQueryError');
    expect(response.body.error.message).to.equal('Incorrect query string');

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

    // on delete - cascade to foodtype, food, etc
    await LocString.destroy({ where: {} });

    foods = await initFoods();
  });

  it('Food GET routes work without authorization', async () => {

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
          model: FoodType,
          as: 'foodType',
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            ...includeNameDescriptionLocNoTimestampsSecondLayer
          ]
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response1.body.nameLoc.id).to.equal(foodInDB?.nameLoc?.id);
    expect(response1.body.nameLoc.mainStr).to.equal(foodInDB?.nameLoc?.mainStr);
    expect(response1.body.descriptionLoc.id).to.equal(foodInDB?.descriptionLoc?.id);
    expect(response1.body.descriptionLoc.mainStr).to.equal(foodInDB?.descriptionLoc?.mainStr);
    expect(response1.body.price).to.equal(foodInDB?.price);

    const response2 = await api
      .get(`${apiBaseUrl}/food`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(foods.length);

  });

  it('Food POST, PUT, DELETE routes require admin rights', async () => {

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

  it('Food POST / adds new food, can be used by admin', async () => {

    const newFood: NewFoodBody = {
      nameLoc: {
        mainStr: 'Маргарита'
      },
      descriptionLoc: {
        mainStr: 'Супергут'
      },
      price: 100500,
      foodTypeId: foods[Math.round(Math.random() * (foods.length - 1))].foodTypeId
    };

    const response = await api
      .post(`${apiBaseUrl}/food`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.mainStr).to.equal(newFood.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(newFood.descriptionLoc.mainStr);

  });

  it('Food PUT / updates food data, can be used by admin', async () => {

    const updFood: EditFoodBody = {
      nameLoc: {
        id: foods[0].nameLocId,
        mainStr: 'Маргарита'
      },
      descriptionLoc: {
        id: foods[0].descriptionLocId,
        mainStr: 'Супергут'
      },
      price: 100500,
      foodTypeId: foods[Math.round(Math.random() * (foods.length - 1))].foodTypeId
    };

    const response = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFood)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFoodInDB = await Food.findByPk(foods[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: FoodType,
          as: 'foodType',
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            ...includeNameDescriptionLocNoTimestampsSecondLayer
          ]
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response.body.nameLoc.mainStr).to.equal(updFood.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(updFood.descriptionLoc.mainStr);
    expect(response.body.price).to.equal(updFood.price);
    expect(response.body.foodType.id).to.equal(updFood.foodTypeId);

    expect(updFoodInDB?.nameLoc?.mainStr).to.equal(updFood.nameLoc.mainStr);
    expect(updFoodInDB?.descriptionLoc?.mainStr).to.equal(updFood.descriptionLoc.mainStr);
    expect(updFoodInDB?.price).to.equal(updFood.price);
    expect(updFoodInDB?.foodTypeId).to.equal(updFood.foodTypeId);

  });

  it('Food DELETE /:id deletes food, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

  it('Food GET / path accepts foodtypeid query key (only numeric as id)', async () => {

    const foodTypes = await FoodType.findAll({
      include: [
        {
          model: Food,
          as: 'foodTypeFoods'
        }
      ]
    });

    const foodTypesWithFoods = foodTypes.filter(foodType => !!foodType.foodTypeFoods && foodType.foodTypeFoods.length > 0);

    const queryFoodTypeId = foodTypesWithFoods[Math.round(Math.random() * (foodTypesWithFoods.length - 1))].id;

    const response = await api
      .get(`${apiBaseUrl}/food/?foodtypeid=${queryFoodTypeId}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodWithQueryFoodTypeIdInDB = await Food.findAll({
      where: { foodTypeId: queryFoodTypeId },
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: FoodType,
          as: 'foodType',
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            ...includeNameDescriptionLocNoTimestampsSecondLayer
          ]
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    expect(response.body).to.be.lengthOf(foodWithQueryFoodTypeIdInDB.length);

    const matchingIndexInArray = foodWithQueryFoodTypeIdInDB.findIndex(food => food.id === response.body[0].id);

    expect(response.body[0].nameLoc.id).to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].nameLoc?.id);
    expect(response.body[0].nameLoc.mainStr).to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].nameLoc?.mainStr);
    expect(response.body[0].descriptionLoc.id).to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].descriptionLoc?.id);
    expect(response.body[0].descriptionLoc.mainStr).to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].descriptionLoc?.mainStr);
    expect(response.body[0].price).to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].price);

  });

  it('Food GET / path does not accept foodtypeid query key if it is not numeric', async () => {

    const response = await api
      .get(`${apiBaseUrl}/food/?foodtypeid=${'some_malicious_query?hope_it_wont_get_through!'}`)
      .set('User-Agent', userAgent)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('RequestQueryError');
    expect(response.body.error.message).to.equal('Incorrect query string');

  });

  it.only('Food GET / path gives mainPicture data for every food if picture found', async () => {

    await Picture.destroy({ where: {} });

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const fakePictureData: NewPictureBody = {
      type: 'foodPicture',
      main: 'true',
      altTextMainStr: 'New Picture! Youll see me if I do not get loaded by browser',
      subjectId: String(randomFoodId)
    };

    // Start of fake picture save
    const savedAltTextLoc = await LocString.create({
      mainStr: fakePictureData.altTextMainStr
    });

    const savedPicture = await Picture.create({
      src: 'fakeSrcPath',
      altTextLocId: savedAltTextLoc.id
    });

    await FoodPicture.create({
      foodId: randomFoodId,
      pictureId: savedPicture.id,
      mainPicture: true
    });
    // End of fake picture save

    const response = await api
      .get(`${apiBaseUrl}/food`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resFoods = response.body as FoodDT[];

    const foodWithPictureInResponse = resFoods.find(food => food.id === randomFoodId);
    if (!foodWithPictureInResponse) return expect(true).to.equal(false);

    expect(foodWithPictureInResponse.mainPicture).to.exist;
    expect(foodWithPictureInResponse.mainPicture?.src).to.equal(savedPicture.src);
    expect(foodWithPictureInResponse.mainPicture?.altTextLoc.mainStr).to.equal(savedAltTextLoc.mainStr);

  });

  it.only('Food GET /:id path gives gallery and foodComponents data if found', async () => {

    await Picture.destroy({ where: {} });

    const ingredients = await initIngredients();
    await initFoodComponents(foods, ingredients);

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const galleryLength = 5;

    for (let i = 0; i < galleryLength; i++) {
      const fakePictureData: NewPictureBody = {
        type: 'foodPicture',
        main: 'false',
        altTextMainStr: 'New Picture! Youll see me if I do not get loaded by browser',
        subjectId: String(randomFoodId)
      };

      // Start of fake picture save
      const savedAltTextLoc = await LocString.create({
        mainStr: fakePictureData.altTextMainStr
      });

      const savedPicture = await Picture.create({
        src: 'fakeSrcPath',
        altTextLocId: savedAltTextLoc.id
      });

      await FoodPicture.create({
        foodId: randomFoodId,
        pictureId: savedPicture.id,
        mainPicture: false
      });
    // End of fake picture save
    }

    const response = await api
      .get(`${apiBaseUrl}/food/${randomFoodId}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resFood = response.body as FoodDT;

    expect(resFood.foodComponents).to.exist;

    const resFoodComponents = resFood.foodComponents as FoodComponentDT[];
    expect(resFoodComponents[0].id).to.exist;
    expect(resFoodComponents[0].amount).to.exist;
    expect(resFoodComponents[0].component).to.exist;
    expect(resFoodComponents[0].compositeFood).to.exist;

    expect(resFood.gallery).to.exist;

    const resFoodGallery = resFood.gallery as PictureDT[];
    expect(resFoodGallery[0].id).to.exist;
    expect(resFoodGallery[0].src).to.exist;
    expect(resFoodGallery[0].altTextLoc).to.exist;
    expect(resFoodGallery[0].altTextLoc.mainStr).to.exist;


  });

});