import type { AddFoodComponentsBody, EditFoodComponentBody } from '@m-cafe-app/utils';
import { timestampsKeys } from '@m-cafe-app/shared-constants';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import {
  connectToDatabase,
  Food,
  FoodComponent,
  Ingredient,
  LocString,
  User
} from '@m-cafe-app/db';
import config from '../utils/config';
import { validAdminInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { validUserInDB } from './user_api_helper';
import { initFoodComponents } from './foodComponents_api_helper';
import { initIngredients } from './ingredient_api_helper';
import { initFoods } from './food_api_helper';



await connectToDatabase();
const api = supertest(app);


describe('FoodComponents requests tests', () => {

  let tokenCookie: string;
  let foods: Food[];
  let ingredients: Ingredient[];

  before(async () => {
    await User.scope('all').destroy({
      force: true,
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    await User.create(validAdminInDB.dtn);
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dtn, validAdminInDB.password, api, 201, userAgent) as string;

    await FoodComponent.destroy({ where: {} });
    await LocString.destroy({ where: {} });

    const initialFoods = await initFoods();
    ingredients = await initIngredients();

    foods = await initFoodComponents(initialFoods, ingredients);
  });

  it('FoodComponents GET route work without authorization', async () => {

    const foodIdToCheck = Math.round(Math.random() * (foods.length - 1));

    const response = await api
      .get(`${apiBaseUrl}/food/${foods[foodIdToCheck].id}/components`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const foodComponentsInDB = await FoodComponent.findAll({
      where: { foodId: foods[foodIdToCheck].id },
      include: [
        {
          model: Food,
          as: 'food',
          attributes: {
            exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', ...timestampsKeys]
          },
          include: [
            {
              model: LocString,
              as: 'nameLoc',
              attributes: {
                exclude: [...timestampsKeys]
              }
            }
          ]
        },
        {
          model: Ingredient,
          as: 'ingredient',
          attributes: {
            exclude: ['nameLocId', 'stockMeasureLocId', ...timestampsKeys]
          },
          include: [
            {
              model: LocString,
              as: 'nameLoc',
              attributes: {
                exclude: [...timestampsKeys]
              }
            }
          ]
        }
      ]
    });

    for (const componentData of response.body) {
      const indexToCheck = foodComponentsInDB.findIndex(foodComponent => foodComponent.id === componentData.id);
      expect(indexToCheck).to.not.equal(-1);

      expect(componentData.amount).to.equal(foodComponentsInDB[indexToCheck].amount);
      expect(componentData.compositeFood).to.equal(foodComponentsInDB[indexToCheck].compositeFood);
      expect(componentData.component.nameLoc!.id).to.equal(foodComponentsInDB[indexToCheck].component!.nameLoc!.id);
    }


  });

  it('FoodComponents POST, PUT, DELETE routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dtn);

    const commonUserTokenCookie = await initLogin(validUserInDB.dtn, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('FoodComponents POST /:(food)id/components adds new food components, can be used by admin. \
Components can be either ingredients or other foods', async () => {

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    await FoodComponent.destroy({ where: { foodId: randomFoodId } });

    const newSimpleFoodComponents: AddFoodComponentsBody = {
      foodComponents: [
        {
          amount: 100,
          compositeFood: false,
          componentId: ingredients[0].id
        },
        {
          amount: 100500,
          compositeFood: false,
          componentId: ingredients[1].id
        }
      ]
    };

    const response1 = await api
      .post(`${apiBaseUrl}/food/${randomFoodId}/components`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newSimpleFoodComponents)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    for (const addedComponent of response1.body) {
      const indexInRequest = newSimpleFoodComponents.foodComponents
        .findIndex(component => component.componentId === addedComponent.componentId);
      expect(indexInRequest).to.not.equal(-1);

      expect(addedComponent.amount).to.equal(newSimpleFoodComponents.foodComponents[indexInRequest].amount);
      expect(addedComponent.compositeFood).to.equal(newSimpleFoodComponents.foodComponents[indexInRequest].compositeFood);
    }

    await FoodComponent.destroy({ where: { foodId: 0 } });

    const newCompositeFoodComponents: AddFoodComponentsBody = {
      foodComponents: [
        {
          amount: 100,
          compositeFood: true,
          componentId: foods[1].id
        },
        {
          amount: 100500,
          compositeFood: true,
          componentId: foods[2].id
        }
      ]
    };

    const response2 = await api
      .post(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newCompositeFoodComponents)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    for (const addedComponent of response2.body) {
      const indexInRequest = newCompositeFoodComponents.foodComponents
        .findIndex(component => component.componentId === addedComponent.componentId);
      expect(indexInRequest).to.not.equal(-1);

      expect(addedComponent.amount).to.equal(newCompositeFoodComponents.foodComponents[indexInRequest].amount);
      expect(addedComponent.compositeFood).to.equal(newCompositeFoodComponents.foodComponents[indexInRequest].compositeFood);
    }

  });

  it('FoodComponents PUT /:(food)id/components can be used by admin - path to replace all components', async () => {

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const updSimpleFoodComponents: AddFoodComponentsBody = {
      foodComponents: [
        {
          amount: 100,
          compositeFood: false,
          componentId: ingredients[0].id
        },
        {
          amount: 100500,
          compositeFood: false,
          componentId: ingredients[1].id
        }
      ]
    };

    const response1 = await api
      .put(`${apiBaseUrl}/food/${randomFoodId}/components`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updSimpleFoodComponents)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    for (const addedComponent of response1.body) {
      const indexInRequest = updSimpleFoodComponents.foodComponents
        .findIndex(component => component.componentId === addedComponent.componentId);
      expect(indexInRequest).to.not.equal(-1);

      expect(addedComponent.amount).to.equal(updSimpleFoodComponents.foodComponents[indexInRequest].amount);
      expect(addedComponent.compositeFood).to.equal(updSimpleFoodComponents.foodComponents[indexInRequest].compositeFood);
    }

    const updCompositeFoodComponents: AddFoodComponentsBody = {
      foodComponents: [
        {
          amount: 100,
          compositeFood: true,
          componentId: foods[1].id
        },
        {
          amount: 100500,
          compositeFood: true,
          componentId: foods[2].id
        }
      ]
    };

    const response2 = await api
      .put(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updCompositeFoodComponents)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    for (const addedComponent of response2.body) {
      const indexInRequest = updCompositeFoodComponents.foodComponents
        .findIndex(component => component.componentId === addedComponent.componentId);
      expect(indexInRequest).to.not.equal(-1);

      expect(addedComponent.amount).to.equal(updCompositeFoodComponents.foodComponents[indexInRequest].amount);
      expect(addedComponent.compositeFood).to.equal(updCompositeFoodComponents.foodComponents[indexInRequest].compositeFood);
    }

  });

  it('FoodComponents PUT /:(food)id/components/:componentId can be used by admin - path to update one component', async () => {

    const randomFoodId = foods[Math.round(Math.random() * (foods.length - 1))].id;

    const foodComponentsToUpdate = await FoodComponent.findAll({ where: { foodId: randomFoodId } });

    const updFoodComponent: EditFoodComponentBody = {
      amount: 100500,
      compositeFood: false,
      componentId: ingredients[0].id
    };

    const response = await api
      .put(`${apiBaseUrl}/food/${randomFoodId}/components/${foodComponentsToUpdate[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFoodComponent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.component.id).to.equal(updFoodComponent.componentId);
    expect(response.body.amount).to.equal(updFoodComponent.amount);
    expect(response.body.compositeFood).to.equal(updFoodComponent.compositeFood);

  });

  it('FoodComponents DELETE /:(food)id/components(/:componentId) delete appropriate number of components, can be used by admin', async () => {

    const foundFoodComponents = await FoodComponent.findAll({ where: { foodId: foods[0].id } });

    // delete one
    await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}/components/${foundFoodComponents[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

    // delete all
    await api
      .delete(`${apiBaseUrl}/food/${foods[0].id}/components`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});