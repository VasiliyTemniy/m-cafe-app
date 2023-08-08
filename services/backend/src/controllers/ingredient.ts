import { Router, RequestHandler } from 'express';
import middleware from '../utils/middleware.js';
import { Ingredient, LocString } from '../models/index.js';
import { DatabaseError, IngredientDT, mapDataToTransit, timestampsKeys, isNewIngredientBody, RequestBodyError, isEditIngredientBody, updateInstance } from '@m-cafe-app/utils';


const ingredientRouter = Router();

ingredientRouter.get(
  '/',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    const ingredients = await Ingredient.findAll({
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

    const resBody: IngredientDT[] = ingredients.map(ingredient => {
      return {
        nameLoc: mapDataToTransit(ingredient.nameLoc!.dataValues),
        stockMeasureLoc: mapDataToTransit(ingredient.stockMeasureLoc!.dataValues),
        ...mapDataToTransit(ingredient.dataValues)
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

ingredientRouter.get(
  '/:id',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    const ingredient = await Ingredient.findByPk(req.params.id, {
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

    if (!ingredient) throw new DatabaseError(`No ingredient entry with this id ${req.params.id}`);

    const resBody: IngredientDT = {
      nameLoc: mapDataToTransit(ingredient.nameLoc!.dataValues),
      stockMeasureLoc: mapDataToTransit(ingredient.stockMeasureLoc!.dataValues),
      ...mapDataToTransit(ingredient.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

ingredientRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewIngredientBody(req.body)) throw new RequestBodyError('Invalid add ingredient request body');

    const { nameLoc, stockMeasureLoc, proteins, fats, carbohydrates, calories } = req.body;

    const savedNameLoc = await LocString.create(nameLoc);
    const savedStockMeasureLoc = await LocString.create(stockMeasureLoc);

    const savedIngredient = await Ingredient.create({
      nameLocId: savedNameLoc.id,
      stockMeasureLocId: savedStockMeasureLoc.id,
      proteins,
      fats,
      carbohydrates,
      calories
    });

    const resBody: IngredientDT = {
      nameLoc: mapDataToTransit(savedNameLoc.dataValues),
      stockMeasureLoc: mapDataToTransit(savedStockMeasureLoc.dataValues),
      ...mapDataToTransit(savedIngredient.dataValues)
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

ingredientRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isEditIngredientBody(req.body)) throw new RequestBodyError('Invalid edit ingredient request body');

    const { nameLoc, stockMeasureLoc, proteins, fats, carbohydrates, calories } = req.body;

    const updIngredient = await Ingredient.findByPk(req.params.id);
    if (!updIngredient) throw new DatabaseError(`No ingredient entry with this id ${req.params.id}`);

    const updNameLoc = await LocString.findOne({ where: { id: nameLoc.id } });
    if (!updNameLoc) throw new DatabaseError(`No localization entry with this id ${nameLoc.id}`);

    const updStockMeasureLoc = await LocString.findOne({ where: { id: stockMeasureLoc.id } });
    if (!updStockMeasureLoc) throw new DatabaseError(`No localization entry with this id ${stockMeasureLoc.id}`);

    updateInstance(updNameLoc, nameLoc);
    updateInstance(updStockMeasureLoc, stockMeasureLoc);

    await updNameLoc.save();
    await updStockMeasureLoc.save();

    if (proteins) updIngredient.proteins = proteins;
    if (fats) updIngredient.fats = fats;
    if (carbohydrates) updIngredient.carbohydrates = carbohydrates;
    if (calories) updIngredient.calories = calories;

    await updIngredient.save();

    const resBody: IngredientDT = {
      nameLoc: mapDataToTransit(updNameLoc.dataValues),
      stockMeasureLoc: mapDataToTransit(updStockMeasureLoc.dataValues),
      ...mapDataToTransit(updIngredient)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

ingredientRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await Ingredient.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default ingredientRouter;