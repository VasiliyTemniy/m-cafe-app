import { Router, RequestHandler } from 'express';
import middleware from '../utils/middleware.js';
import { Food, FoodType, LocString } from '../models/index.js';
import {
  FoodTypeDT,
  isNewFoodTypeBody,
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys,
  DatabaseError,
  updateInstance,
  isEditFoodTypeBody,
  RequestQueryError
} from '@m-cafe-app/utils';
import { includeNameDescriptionLocNoTimestamps } from '../utils/sequelizeHelpers.js';


const foodTypeRouter = Router();

foodTypeRouter.get(
  '/',
  (async (req, res) => {

    let withFoodOnly = false;

    if (req.query.withfoodonly) {
      if (isNaN(Number(req.query.withfoodonly))) throw new RequestQueryError('Incorrect query string');
      withFoodOnly = Boolean(Number(req.query.withfoodonly));
    }

    // Form sequelize include list for all food types _or_ only those with food
    const includeList: {
      model: typeof LocString | typeof Food;
      as: string;
      attributes?: {
          exclude: string[];
      };
    }[] = [
      ...includeNameDescriptionLocNoTimestamps
    ];

    if (withFoodOnly) includeList.push({
      model: Food,
      as: 'foodTypeFoods'
    });


    const foodTypes = await FoodType.findAll({
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        ...includeList
      ]
    });


    const resFoodTypes =
      withFoodOnly ? foodTypes.filter(foodType => !!foodType.foodTypeFoods && foodType.foodTypeFoods.length > 0)
      : foodTypes;


    const resBody: FoodTypeDT[] = resFoodTypes.map(foodType => {
      return {
        id: foodType.id,
        nameLoc: mapDataToTransit(foodType.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(foodType.descriptionLoc!.dataValues)
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodTypeRouter.get(
  '/:id',
  (async (req, res) => {

    const foodType = await FoodType.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    if (!foodType) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const resBody: FoodTypeDT = {
      id: foodType.id,
      nameLoc: mapDataToTransit(foodType.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(foodType.descriptionLoc!.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodTypeRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewFoodTypeBody(req.body)) throw new RequestBodyError('Invalid add food type request body');

    const { nameLoc, descriptionLoc } = req.body;

    const savedNameLoc = await LocString.create(nameLoc);
    const savedDescriptionLoc = await LocString.create(descriptionLoc);

    const savedFoodType = await FoodType.create({
      nameLocId: savedNameLoc.id,
      descriptionLocId: savedDescriptionLoc.id
    });

    const resBody: FoodTypeDT = {
      id: savedFoodType.id,
      nameLoc: mapDataToTransit(savedNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(savedDescriptionLoc.dataValues)
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

foodTypeRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isEditFoodTypeBody(req.body)) throw new RequestBodyError('Invalid add food type request body');

    const { nameLoc, descriptionLoc } = req.body;

    const updFoodType = await FoodType.findByPk(req.params.id);
    if (!updFoodType) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    const updNameLoc = await LocString.findOne({ where: { id: nameLoc.id } });
    if (!updNameLoc) throw new DatabaseError(`No localization entry with this id ${nameLoc.id}`);

    const updDescriptionLoc = await LocString.findOne({ where: { id: descriptionLoc.id } });
    if (!updDescriptionLoc) throw new DatabaseError(`No localization entry with this id ${descriptionLoc.id}`);

    updateInstance(updNameLoc, nameLoc);
    updateInstance(updDescriptionLoc, descriptionLoc);

    await updNameLoc.save();
    await updDescriptionLoc.save();

    await updFoodType.save();

    const resBody: FoodTypeDT = {
      id: updFoodType.id,
      nameLoc: mapDataToTransit(updNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(updDescriptionLoc.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

foodTypeRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await FoodType.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default foodTypeRouter;