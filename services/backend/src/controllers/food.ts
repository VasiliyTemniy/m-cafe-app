import { Router, RequestHandler } from 'express';
import middleware from '../utils/middleware.js';
import { Food, FoodComponent, FoodPicture, FoodType, LocString, Picture } from '../models/index.js';
import {
  FoodDT,
  isNewFoodBody,
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys,
  isEditFoodBody,
  DatabaseError,
  updateInstance,
  RequestQueryError
} from '@m-cafe-app/utils';
import {
  includeAltTextLocNoTimestamps,
  includeFoodComponentData,
  includeNameDescriptionLocNoTimestamps,
  includeNameDescriptionLocNoTimestampsSecondLayer,
} from '../utils/sequelizeHelpers.js';


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
          model: FoodType,
          as: 'foodType',
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            ...includeNameDescriptionLocNoTimestampsSecondLayer
          ]
        },
        {
          model: FoodPicture,
          as: 'mainPicture',
          required: false,
          where: {
            mainPicture: true
          },
          include: [
            {
              model: Picture,
              as: 'picture',
              attributes: {
                exclude: [...timestampsKeys]
              },
              include: [
                includeAltTextLocNoTimestamps
              ]
            }
          ]
        },
        ...includeNameDescriptionLocNoTimestamps,
      ]
    });

    const resBody: FoodDT[] = foods.map(food => {
      return {
        nameLoc: mapDataToTransit(food.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(food.descriptionLoc!.dataValues),
        foodType: {
          nameLoc: mapDataToTransit(food.foodType!.nameLoc!.dataValues),
          descriptionLoc: mapDataToTransit(food.foodType!.descriptionLoc!.dataValues),
          ...mapDataToTransit(food.foodType!.dataValues)
        },
        ...mapDataToTransit(food.dataValues)
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const food = await Food.findByPk(req.params.id, {
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
        {
          model: FoodPicture,
          as: 'gallery',
          required: false,
          include: [
            {
              model: Picture,
              as: 'picture',
              attributes: {
                exclude: [...timestampsKeys]
              },
              include: [
                includeAltTextLocNoTimestamps
              ]
            }
          ]
        },
        {
          model: FoodComponent,
          as: 'foodComponents',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            ...includeFoodComponentData
          ]
        },
        ...includeNameDescriptionLocNoTimestamps,
      ]
    });

    if (!food) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const resBody: FoodDT = {
      nameLoc: mapDataToTransit(food.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(food.descriptionLoc!.dataValues),
      foodType: {
        nameLoc: mapDataToTransit(food.foodType!.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(food.foodType!.descriptionLoc!.dataValues),
        ...mapDataToTransit(food.foodType!.dataValues)
      },
      ...mapDataToTransit(food.dataValues)
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
        ...includeNameDescriptionLocNoTimestamps
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
      price: savedFood.price,
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
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditFoodBody(req.body)) throw new RequestBodyError('Invalid add food request body');

    const { nameLoc, descriptionLoc, price, foodTypeId } = req.body;

    const updFood = await Food.findByPk(req.params.id);
    if (!updFood) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const updFoodType = await FoodType.findByPk(foodTypeId, {
      include: [
        ...includeNameDescriptionLocNoTimestamps
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
      price: updFood.price,
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
  middleware.requestParamsCheck,
  (async (req, res) => {

    await Food.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default foodRouter;