import { Router, RequestHandler } from 'express';
import middleware from '../utils/middleware.js';
import { Food, FoodComponent, Ingredient } from '@m-cafe-app/db';
import {
  mapDataToTransit,
  RequestBodyError,
  timestampsKeys,
  DatabaseError,
  isAddFoodComponentsBody,
  NewFoodComponent,
  isEditFoodComponentBody,
  FoodComponentDT,
} from '@m-cafe-app/utils';
import {
  includeFoodComponentData,
  includeNameLocNoTimestamps
} from '../utils/sequelizeHelpers.js';



const foodComponentRouter = Router();

/**
 * Path to get all food components
 */
foodComponentRouter.get(
  '/:id/components',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const foodComponents = await FoodComponent.findAll({
      where: { foodId: req.params.id },
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        ...includeFoodComponentData
      ]
    });

    if (!foodComponents) throw new DatabaseError(`No food components entries with this id ${req.params.id}`);

    const resBody: FoodComponentDT[] = foodComponents.map(foodComponent => {
      return {
        component: {
          nameLoc: mapDataToTransit(foodComponent.component!.nameLoc!.dataValues),
          ...mapDataToTransit(foodComponent.component!.dataValues)
        },
        ...mapDataToTransit(foodComponent.dataValues)
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

/**
 * Path to add new food components
 */
foodComponentRouter.post(
  '/:id/components',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isAddFoodComponentsBody(req.body)) throw new RequestBodyError('Invalid add food components request body');

    const { foodComponents } = req.body;

    const foodToAddComponents = await Food.findByPk(req.params.id, {
      attributes: {
        exclude: ['id', 'nameLocID', 'descriptionLocId', 'foodTypeId', 'price', ...timestampsKeys]
      },
      include: [
        {
          model: FoodComponent,
          as: 'foodComponents',
          attributes: {
            exclude: [...timestampsKeys]
          }
        }
      ]
    });

    if (!foodToAddComponents) throw new DatabaseError(`No food entry with this id ${req.params.id}`);

    let foodComponentsToAdd: NewFoodComponent[];

    if (!foodToAddComponents.foodComponents || foodToAddComponents.foodComponents.length === 0) {
      foodComponentsToAdd = foodComponents;
    } else {
      const existingComponentsIds = foodToAddComponents.foodComponents.map(foodComponent => foodComponent.componentId);
      foodComponentsToAdd = foodComponents.filter(foodComponent => !existingComponentsIds.includes(foodComponent.componentId));
    }

    // Check if those components exist in DB before adding. Needed because componentId has no foreignKey constaints
    for (const foodComponent of foodComponentsToAdd) {
      if (foodComponent.compositeFood) {
        const foundFood = await Food.findByPk(foodComponent.componentId);
        if (!foundFood) throw new DatabaseError(`No food entry with this id ${foodComponent.componentId}. Check componentIds for new food components`);
      } else {
        const foundIngredient = await Ingredient.findByPk(foodComponent.componentId);
        if (!foundIngredient) throw new DatabaseError(`No ingredient entry with this id ${foodComponent.componentId}. Check componentIds for new food components`);
      }
    }

    const addedFoodComponents = await FoodComponent.bulkCreate(foodComponentsToAdd.map(foodComponent => {
      return {
        foodId: Number(req.params.id),
        // componentId: foodComponent.componentId,  <-- Use these for some kind of safety?
        // amount: foodComponent.amount,
        // compositeFood: foodComponent.compositeFood
        ...foodComponent
      };
    }));

    const resBody: NewFoodComponent[] = addedFoodComponents.map(addedFoodComponent => addedFoodComponent.dataValues);

    res.status(201).json(resBody);

  }) as RequestHandler
);

/**
 * Path to rewrite all food components at once
 */
foodComponentRouter.put(
  '/:id/components',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isAddFoodComponentsBody(req.body)) throw new RequestBodyError('Invalid add food components request body');

    const { foodComponents } = req.body;

    const foodToAddComponents = await Food.findByPk(req.params.id);

    if (!foodToAddComponents) throw new DatabaseError(`No food type entry with this id ${req.params.id}`);

    // Check if those components exist in DB before adding. Needed because componentId has no foreignKey constaints
    for (const foodComponent of foodComponents) {
      if (foodComponent.compositeFood) {
        const foundFood = await Food.findByPk(foodComponent.componentId);
        if (!foundFood) throw new DatabaseError(`No food entry with this id ${foodComponent.componentId}. Check componentIds for new food components`);
      } else {
        const foundIngredient = await Ingredient.findByPk(foodComponent.componentId);
        if (!foundIngredient) throw new DatabaseError(`No ingredient entry with this id ${foodComponent.componentId}. Check componentIds for new food components`);
      }
    }

    await FoodComponent.destroy({ where: { foodId: req.params.id } });

    const addedFoodComponents = await FoodComponent.bulkCreate(foodComponents.map(foodComponent => {
      return {
        foodId: Number(req.params.id),
        // componentId: foodComponent.componentId,  <-- Use these for some kind of safety?
        // amount: foodComponent.amount,
        // compositeFood: foodComponent.compositeFood
        ...foodComponent
      };
    }));

    const resBody: NewFoodComponent[] = addedFoodComponents.map(addedFoodComponent => addedFoodComponent.dataValues);

    res.status(200).json(resBody);

  }) as RequestHandler
);

/**
 * Path to update one food component
 */
foodComponentRouter.put(
  '/:id/components/:foodComponentId',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditFoodComponentBody(req.body)) throw new RequestBodyError('Invalid add food components request body');

    const { componentId, compositeFood, amount } = req.body;

    const foodToEditComponent = await Food.findByPk(req.params.id);

    if (!foodToEditComponent) throw new DatabaseError(`No food entry with this id ${req.params.id}`);

    const updFoodComponent = await FoodComponent.findByPk(req.params.foodComponentId);

    if (!updFoodComponent) throw new DatabaseError(`No food component entry with this id ${req.params.foodComponentId}`);

    let foundComponent: Food | Ingredient | null;
    
    if (compositeFood) {
      foundComponent = await Food.findByPk(componentId, {
        attributes: {
          exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', ...timestampsKeys]
        },
        include: [
          includeNameLocNoTimestamps
        ]
      });
      if (!foundComponent) throw new DatabaseError(`No food entry with this id ${componentId}`);
    } else {
      foundComponent = await Ingredient.findByPk(componentId, {
        attributes: {
          exclude: ['nameLocId', 'stockMeasureLocId', ...timestampsKeys]
        },
        include: [
          includeNameLocNoTimestamps
        ]
      });
      if (!foundComponent) throw new DatabaseError(`No ingredient entry with this id ${componentId}`);
    } 


    updFoodComponent.componentId = componentId;
    updFoodComponent.amount = amount;
    updFoodComponent.compositeFood = compositeFood;

    await updFoodComponent.save();

    const resBody: FoodComponentDT = {
      component: {
        nameLoc: mapDataToTransit(foundComponent.nameLoc!.dataValues),
        ...mapDataToTransit(foundComponent.dataValues)
      },
      ...mapDataToTransit(updFoodComponent.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

/**
 * Path to delete all food components for particular food
 */
foodComponentRouter.delete(
  '/:id/components',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await FoodComponent.destroy({ where: { foodId: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

/**
 * Path to delete one food component
 */
foodComponentRouter.delete(
  '/:id/components/:foodComponentId',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await FoodComponent.destroy({ where: { foodId: req.params.id, componentId: req.params.foodComponentId } });

    res.status(204).end();

  }) as RequestHandler
);

export default foodComponentRouter;