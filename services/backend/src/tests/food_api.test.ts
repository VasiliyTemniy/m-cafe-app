import type {
  FoodComponentDT,
  FoodDT,
  FoodDTN,
  FoodPictureDT,
  FoodTypeDT,
  FoodTypeDTN,
  PictureForFoodDTN
} from '@m-cafe-app/models';
import { FoodType as FoodTypePG } from '@m-cafe-app/db';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { createAdmin, validAdminInDB } from './admin_api_helper';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { initFoods, initFoodTypes } from './food_api_helper';
import { createUser, validUserInDB } from './user_api_helper';
import { initFoodComponents } from './foodComponents_api_helper';
import { initIngredients } from './ingredient_api_helper';
import { foodService, foodTypeService, pictureService, sessionService, userService } from '../controllers';
import { FoodPictureRepoSequelizePG } from '@m-cafe-app/backend-logic';
import { LocStringRepoSequelizePG } from '@m-cafe-app/backend-logic/build/models/LocString';


const api = supertest(app);


describe('Food type requests tests', () => {

  let tokenCookie: string;
  let foodTypes: FoodTypeDT[];

  before(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    const admin = await createAdmin(validAdminInDB.dtn);
    await sessionService.removeAll();
    tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    await foodService.removeAll();
    await foodTypeService.removeAll();

    foodTypes = await initFoodTypes();
    await initFoods(foodTypes);
  });

  it('Food type GET routes work without authorization', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodTypeInDB = await foodTypeService.foodTypeRepo.getById(foodTypes[0].id);

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

    const customer = await createUser(validUserInDB.dtn);

    const commonUserTokenCookie = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/foodtype`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('Food type POST / adds new food type, can be used by admin', async () => {

    const newFoodType: FoodTypeDTN = {
      nameLoc: {
        mainStr: 'Пицца'
      },
      descriptionLoc: {
        mainStr: 'Круглая выпечка с открытой начинкой'
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/foodtype`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFoodType)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.mainStr).to.equal(newFoodType.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(newFoodType.descriptionLoc.mainStr);

  });

  it('Food type PUT /:id updates food type data, can be used by admin', async () => {

    const updFoodType: FoodTypeDT = {
      id: foodTypes[0].id,
      nameLoc: {
        id: foodTypes[0].nameLoc.id,
        mainStr: 'Пицца',
        secStr: 'Pizza',
        altStr: 'Donnerwetter'
      },
      descriptionLoc: {
        id: foodTypes[0].descriptionLoc.id,
        mainStr: 'Круглая выпечка с открытой начинкой',
        secStr: 'Pizza-pizza pie',
        altStr: 'vayvah'
      }
    };

    const response = await api
      .put(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFoodType)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFoodTypeInDB = await foodTypeService.foodTypeRepo.getById(updFoodType.id);

    expect(response.body.nameLoc.mainStr).to.equal(updFoodType.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(updFoodType.descriptionLoc.mainStr);

    expect(updFoodTypeInDB?.nameLoc?.mainStr).to.equal(updFoodType.nameLoc.mainStr);
    expect(updFoodTypeInDB?.descriptionLoc?.mainStr).to.equal(updFoodType.descriptionLoc.mainStr);

  });

  it('Food type DELETE /:id deletes a food type, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/foodtype/${foodTypes[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

  it('Food type GET / path accepts withfoodonly query key', async () => {

    const foodTypesInDB = await FoodTypePG.scope('allWithFood').findAll();

    const response = await api
      .get(`${apiBaseUrl}/foodtype/?withfoodonly=true`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    for (const foodTypeInRes of response.body) {
      expect(
        foodTypesInDB
          .find(foodTypeInDB => foodTypeInDB.id === foodTypeInRes.id)
          ?.foods
          ?.length
      ).to.be.above(0);
    }

  });

  // it('Food type GET / path does not accept withfoodonly query key if it is not numeric', async () => {

  //   const response = await api
  //     .get(`${apiBaseUrl}/foodtype/?withfoodonly=${'some_malicious_query?hope_it_wont_get_through!'}`)
  //     .set('User-Agent', userAgent)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/);

  //   expect(response.body.error.name).to.equal('RequestQueryError');
  //   expect(response.body.error.message).to.equal('Incorrect query string');

  // });

});


describe('Food requests tests', () => {

  let tokenCookie: string;
  let foods: FoodDT[];

  let locStringRepo: LocStringRepoSequelizePG;
  let foodPictureRepo: FoodPictureRepoSequelizePG;

  before(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    const admin = await createAdmin(validAdminInDB.dtn);
    await sessionService.removeAll();
    tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    await foodService.removeAll();
    await foodTypeService.removeAll();

    await pictureService.removeAll();

    foodPictureRepo = new FoodPictureRepoSequelizePG();
    await foodPictureRepo.removeAll();

    locStringRepo = new LocStringRepoSequelizePG();

    const foodTypes = await initFoodTypes();
    foods = await initFoods(foodTypes);
  });

  it('Food GET routes work without authorization', async () => {

    // TODO: REWORK!!! include foods in food types, not the other way around

    const response1 = await api
      .get(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('User-Agent', userAgent);
      // .expect(200)
      // .expect('Content-Type', /application\/json/);

    console.log('FOOD GET / ', response1.body);

    const foodInDB = await foodService.foodRepo.getById(foods[0].id);

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

    const customer = await createUser(validUserInDB.dtn);

    const commonUserTokenCookie = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/food`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('Food POST / adds new food, can be used by admin', async () => {

    const newFood: FoodDTN = {
      nameLoc: {
        mainStr: 'Маргарита'
      },
      descriptionLoc: {
        mainStr: 'Супергут'
      },
      price: 100500,
      foodTypeId: foods[Math.round(Math.random() * (foods.length - 1))].foodType.id
    };

    const response = await api
      .post(`${apiBaseUrl}/food`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newFood);
      // .expect(201)
      // .expect('Content-Type', /application\/json/);

    console.log('FOOD POST / ', response.body);

    expect(response.body.nameLoc.mainStr).to.equal(newFood.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(newFood.descriptionLoc.mainStr);

  });

  it('Food PUT /:id updates food data, can be used by admin', async () => {

    const randomFood = foods[Math.round(Math.random() * (foods.length - 1))];

    const updFood: FoodDT = {
      id: randomFood.id,
      nameLoc: {
        id: randomFood.nameLoc.id,
        mainStr: 'Маргарита'
      },
      descriptionLoc: {
        id: randomFood.descriptionLoc.id,
        mainStr: 'Супергут'
      },
      price: 100500,
      foodType: randomFood.foodType
    };

    const response = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFood);
      // .expect(200)
      // .expect('Content-Type', /application\/json/);

    console.log('FOOD PUT / ', response.body);

    const updFoodInDB = await foodService.foodRepo.getById(updFood.id);

    expect(response.body.nameLoc.mainStr).to.equal(updFood.nameLoc.mainStr);
    expect(response.body.descriptionLoc.mainStr).to.equal(updFood.descriptionLoc.mainStr);
    expect(response.body.price).to.equal(updFood.price);
    expect(response.body.foodType.id).to.equal(updFood.foodType.id);

    expect(updFoodInDB?.nameLoc?.mainStr).to.equal(updFood.nameLoc.mainStr);
    expect(updFoodInDB?.descriptionLoc?.mainStr).to.equal(updFood.descriptionLoc.mainStr);
    expect(updFoodInDB?.price).to.equal(updFood.price);
    expect(updFoodInDB?.foodType.id).to.equal(updFood.foodType.id);

  });

  it('Food DELETE /:id deletes food, can be used by admin', async () => {

    const tempoResponse = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent);
      // .expect(204);

    console.log('FOOD DELETE / ', tempoResponse.body);

  });

  it('Food GET / path accepts foodtypeid query key (only numeric as id)', async () => {

    const withFoodOnly = true;
    const foodTypesWithFoods = await foodTypeService.getAll(withFoodOnly);

    const queryFoodTypeId = foodTypesWithFoods[Math.round(Math.random() * (foodTypesWithFoods.length - 1))].id;

    const response = await api
      .get(`${apiBaseUrl}/food/?foodtypeid=${queryFoodTypeId}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodWithQueryFoodTypeIdInDB = await foodService.getSomeWithAssociations(
      { components: false, mainPicture: false, gallery: false },
      undefined,
      undefined,
      queryFoodTypeId
    );

    expect(response.body).to.be.lengthOf(foodWithQueryFoodTypeIdInDB.length);

    const matchingIndexInArray = foodWithQueryFoodTypeIdInDB.findIndex(food => food.id === response.body[0].id);

    expect(response.body[0].nameLoc.id)
      .to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].nameLoc?.id);
    expect(response.body[0].nameLoc.mainStr)
      .to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].nameLoc?.mainStr);
    expect(response.body[0].descriptionLoc.id)
      .to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].descriptionLoc?.id);
    expect(response.body[0].descriptionLoc.mainStr)
      .to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].descriptionLoc?.mainStr);
    expect(response.body[0].price)
      .to.equal(foodWithQueryFoodTypeIdInDB[matchingIndexInArray].price);

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

  it('Food GET / path gives mainPicture data for every food if picture found', async () => {

    // await FoodPicture.destroy({ where: {} });
    // await Picture.destroy({ where: {} });

    // await LocString.destroy({ where: {} });

    // const foods = await initFoods();

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const fakePictureData: PictureForFoodDTN = {
      orderNumber: '0',
      altTextMainStr: 'New Picture! Youll see me if I do not get loaded by browser',
      foodId: String(randomFoodId)
    };

    // Start of fake picture save
    const savedAltTextLoc = await locStringRepo.create({
      mainStr: fakePictureData.altTextMainStr
    });

    const savedPicture = await pictureService.pictureRepo.create(
      'fakeSrcPath',
      savedAltTextLoc
    );

    await foodPictureRepo.create({
      foodId: randomFoodId,
      pictureId: savedPicture.id,
      orderNumber: Number(fakePictureData.orderNumber)
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
    expect(foodWithPictureInResponse.mainPicture?.picture.src).to.equal(savedPicture.src);
    expect(foodWithPictureInResponse.mainPicture?.picture.altTextLoc.mainStr).to.equal(savedAltTextLoc.mainStr);

  });

  it('Food GET /:id path gives gallery and foodComponents data if found', async () => {

    // await FoodPicture.destroy({ where: {} });
    // await Picture.destroy({ where: {} });

    // await FoodComponent.destroy({ where: {} });
    // await LocString.destroy({ where: {} });

    // const foods = await initFoods();

    const ingredients = await initIngredients();
    await initFoodComponents(foods, ingredients);

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const galleryLength = 5;

    for (let i = 0; i < galleryLength; i++) {
      const fakePictureData: PictureForFoodDTN = {
        orderNumber: String(i),
        altTextMainStr: 'New Picture! Youll see me if I do not get loaded by browser',
        foodId: String(randomFoodId)
      };

      // Start of fake picture save
      const savedAltTextLoc = await locStringRepo.create({
        mainStr: fakePictureData.altTextMainStr
      });
  
      const savedPicture = await pictureService.pictureRepo.create(
        'fakeSrcPath',
        savedAltTextLoc
      );
  
      await foodPictureRepo.create({
        foodId: randomFoodId,
        pictureId: savedPicture.id,
        orderNumber: Number(fakePictureData.orderNumber)
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
    expect(resFoodComponents[0].quantity).to.exist;
    expect(resFoodComponents[0].component).to.exist;
    expect(resFoodComponents[0].compositeFood).to.exist;

    expect(resFood.gallery).to.exist;

    const resFoodGallery = resFood.gallery as FoodPictureDT[];
    expect(resFoodGallery[0].picture.id).to.exist;
    expect(resFoodGallery[0].picture.src).to.exist;
    expect(resFoodGallery[0].picture.altTextLoc).to.exist;
    expect(resFoodGallery[0].picture.altTextLoc.mainStr).to.exist;
    expect(resFoodGallery[0].orderNumber).to.exist;


  });

});