import { EditIngredientBody, NewIngredientBody, timestampsKeys } from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { Ingredient, LocString, User } from "../models";
import config from "../utils/config";
import { connectToDatabase } from "../utils/db";
import { validAdminInDB, validManagerInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { validUserInDB } from "./users_api_helper";
import { initIngredients } from "./ingredient_api_helper";



await connectToDatabase();
const api = supertest(app);


describe('Ingredient type requests tests', () => {

  let tokenCookieAdmin: string;
  let tokenCookieManager: string;
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

    await User.create(validAdminInDB.dbEntry);
    await User.create(validManagerInDB.dbEntry);

    await Session.destroy({ where: {} });
    
    tokenCookieAdmin = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;
    tokenCookieManager = await initLogin(validManagerInDB.dbEntry, validManagerInDB.password, api, 201, userAgent) as string;

    // on delete - cascade to ingredient, etc
    await LocString.destroy({ where: {} });

    ingredients = await initIngredients();
  });

  it('Ingredient type GET routes work with authorization from user with at least manager rights', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [tokenCookieManager])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const ingredientInDB = await Ingredient.findByPk(ingredients[0].id, {
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
          as: 'stockMeasureLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        }
      ]
    });

    expect(response1.body.nameLoc.id).to.equal(ingredientInDB?.nameLoc?.id);
    expect(response1.body.nameLoc.ruString).to.equal(ingredientInDB?.nameLoc?.ruString);
    expect(response1.body.stockMeasureLoc.id).to.equal(ingredientInDB?.stockMeasureLoc?.id);
    expect(response1.body.stockMeasureLoc.ruString).to.equal(ingredientInDB?.stockMeasureLoc?.ruString);

    const response2 = await api
      .get(`${apiBaseUrl}/ingredient`)
      .set("Cookie", [tokenCookieManager])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(ingredients.length);

  });

  it('Ingredient POST, PUT, DELETE routes require admin rights; GET route require at least manager rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/ingredient`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

    const response5 = await api
      .get(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response5.body.error.name).to.equal('ProhibitedError');

    const response6 = await api
      .get(`${apiBaseUrl}/ingredient`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response6.body.error.name).to.equal('ProhibitedError');

    const response7 = await api
      .delete(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [tokenCookieManager])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response7.body.error.name).to.equal('ProhibitedError');

    const response8 = await api
      .post(`${apiBaseUrl}/ingredient`)
      .set("Cookie", [tokenCookieManager])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response8.body.error.name).to.equal('ProhibitedError');

    const response9 = await api
      .put(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [tokenCookieManager])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response9.body.error.name).to.equal('ProhibitedError');
  });

  it('A valid new ingredient can be added by admin', async () => {

    const newIngredient: NewIngredientBody = {
      nameLoc: {
        ruString: 'Листья салата'
      },
      stockMeasureLoc: {
        ruString: 'гр'
      },
      proteins: 1,
      fats: 0,
      carbohydrates: 5,
      calories: 30
    };

    const response = await api
      .post(`${apiBaseUrl}/ingredient`)
      .set("Cookie", [tokenCookieAdmin])
      .set('User-Agent', userAgent)
      .send(newIngredient)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nameLoc.ruString).to.equal(newIngredient.nameLoc.ruString);
    expect(response.body.stockMeasureLoc.ruString).to.equal(newIngredient.stockMeasureLoc.ruString);
    expect(response.body.proteins).to.equal(newIngredient.proteins);
    expect(response.body.fats).to.equal(newIngredient.fats);
    expect(response.body.carbohydrates).to.equal(newIngredient.carbohydrates);
    expect(response.body.calories).to.equal(newIngredient.calories);

  });

  it('Ingredient can be updated by admin', async () => {

    const updIngredient: EditIngredientBody = {
      nameLoc: {
        id: ingredients[0].nameLocId,
        ruString: 'Морковко',
        enString: 'Carrot'
      },
      stockMeasureLoc: {
        id: ingredients[0].stockMeasureLocId,
        ruString: 'гр',
        enString: 'gr'
      },
      proteins: 100500
    };

    const response = await api
      .put(`${apiBaseUrl}/ingredient/${ingredients[0].id}`)
      .set("Cookie", [tokenCookieAdmin])
      .set('User-Agent', userAgent)
      .send(updIngredient)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updIngredientInDB = await Ingredient.findByPk(ingredients[0].id, {
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
          as: 'stockMeasureLoc',
          attributes: {
            exclude: [...timestampsKeys]
          }
        },
      ]
    });

    expect(response.body.nameLoc.ruString).to.equal(updIngredient.nameLoc.ruString);
    expect(response.body.stockMeasureLoc.ruString).to.equal(updIngredient.stockMeasureLoc.ruString);
    expect(response.body.proteins).to.equal(updIngredient.proteins);

    expect(updIngredientInDB?.nameLoc?.ruString).to.equal(updIngredient.nameLoc.ruString);
    expect(updIngredientInDB?.stockMeasureLoc?.ruString).to.equal(updIngredient.stockMeasureLoc.ruString);
    expect(updIngredientInDB?.proteins).to.equal(updIngredient.proteins);

  });

  it('Ingredient can be deleted by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/foodtype/${ingredients[0].id}`)
      .set("Cookie", [tokenCookieAdmin])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});