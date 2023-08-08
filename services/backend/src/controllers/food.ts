import { Router, RequestHandler } from 'express';
import middleware from '../utils/middleware.js';
import { Food, FoodType, LocString } from '../models/index.js';
import {
  FoodDT,
  isNewFoodBody,
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys,
  isEditFoodBody,
  DatabaseError,
  updateInstance,
  RequestQueryError,
} from '@m-cafe-app/utils';


const foodRouter = Router();

foodRouter.get(
  '/',
  (async (req, res) => {

    let where = {};

    if (req.query.foodtypeid) {
      if (isNaN(Number(req.query.foodtypeid))) throw new RequestQueryError('Incorrect query string');
      where = { foodTypeId: Number(req.query.foodtypeid) };
    }

    const foods = await Food.findAll({
      where,
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

    const resBody: FoodDT[] = foods.map(food => {
      return {
        id: food.id,
        nameLoc: mapDataToTransit(food.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(food.descriptionLoc!.dataValues),
        price: food.price,
        foodType: {
          id: food.foodType!.id,
          nameLoc: mapDataToTransit(food.foodType!.nameLoc!.dataValues),
          descriptionLoc: mapDataToTransit(food.foodType!.descriptionLoc!.dataValues)
        }
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodRouter.get(
  '/:id',
  (async (req, res) => {

    const food = await Food.findByPk(req.params.id, {
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

    if (!food) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const resBody: FoodDT = {
      id: food.id,
      nameLoc: mapDataToTransit(food.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(food.descriptionLoc!.dataValues),
      price: food.price,
      foodType: {
        id: food.foodType!.id,
        nameLoc: mapDataToTransit(food.foodType!.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(food.foodType!.descriptionLoc!.dataValues)
      }
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewFoodBody(req.body)) throw new RequestBodyError('Invalid add food request body');

    const { nameLoc, descriptionLoc, price, foodTypeId } = req.body;

    const existingFoodType = await FoodType.findByPk(foodTypeId, {
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

    if (!existingFoodType) throw new DatabaseError(`No food type entry with this id ${foodTypeId}`); 

    const savedNameLoc = await LocString.create(nameLoc);
    const savedDescriptionLoc = await LocString.create(descriptionLoc);

    const savedFood = await Food.create({
      nameLocId: savedNameLoc.id,
      descriptionLocId: savedDescriptionLoc.id,
      price,
      foodTypeId
    });

    const resBody: FoodDT = {
      id: savedFood.id,
      nameLoc: mapDataToTransit(savedNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(savedDescriptionLoc.dataValues),
      price,
      foodType: {
        id: foodTypeId,
        nameLoc: mapDataToTransit(existingFoodType.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(existingFoodType.descriptionLoc!.dataValues)
      }
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

foodRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isEditFoodBody(req.body)) throw new RequestBodyError('Invalid add food request body');

    const { nameLoc, descriptionLoc, price, foodTypeId } = req.body;

    const updFood = await Food.findByPk(req.params.id);
    if (!updFood) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const updFoodType = await FoodType.findByPk(foodTypeId, {
      include: [
        {
          model: LocString,
          as: 'nameLoc',
        },
        {
          model: LocString,
          as: 'descriptionLoc',
        }
      ]
    });
    if (!updFoodType) throw new DatabaseError(`No food type entry with this id ${foodTypeId}`);

    const updNameLoc = await LocString.findOne({ where: { id: nameLoc.id } });
    if (!updNameLoc) throw new DatabaseError(`No localization entry with this id ${nameLoc.id}`);

    const updDescriptionLoc = await LocString.findOne({ where: { id: descriptionLoc.id } });
    if (!updDescriptionLoc) throw new DatabaseError(`No localization entry with this id ${descriptionLoc.id}`);

    updateInstance(updNameLoc, nameLoc);
    updateInstance(updDescriptionLoc, descriptionLoc);

    await updNameLoc.save();
    await updDescriptionLoc.save();

    updFood.price = price;
    updFood.foodTypeId = foodTypeId;

    await updFood.save();

    const resBody: FoodDT = {
      id: updFood.id,
      nameLoc: mapDataToTransit(updNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(updDescriptionLoc.dataValues),
      price,
      foodType: {
        id: foodTypeId,
        nameLoc: mapDataToTransit(updFoodType.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(updFoodType.descriptionLoc!.dataValues)
      }
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await Food.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default foodRouter;