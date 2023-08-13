import config from '../utils/config.js';
import jwt from 'jsonwebtoken';
import {
  AuthorizationError,
  DatabaseError,
  isEditOrderBody,
  isEditOrderStatusBody,
  isNewOrderBody,
  mapDataToTransit,
  NewOrderFood,
  OrderDT,
  OrderDTS,
  OrderFoodDT,
  ProhibitedError,
  RequestBodyError,
  timestampsKeys,
  UnknownError,
} from '@m-cafe-app/utils';
import { Router, RequestHandler } from 'express';
import { Facility, Food, Order, OrderFood } from '../models/index.js';
import { isCustomPayload } from '../types/JWTPayloadCustom.js';
import middleware from '../utils/middleware.js';
import { includeNameLocNoTimestamps } from '../utils/sequelizeHelpers.js';
import { isRequestCustom } from '../types/RequestCustom.js';
import { Session } from '../redis/Session.js';


const orderRouter = Router();


orderRouter.get(
  '/all/:userId',
  middleware.verifyToken,
  middleware.userCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    // Check if user attempts to get other user's order info. Permitted for managers and admins
    if (Number(req.params.userId) !== req.userId) {
      const userRights = await Session.getUserRightsCache(req.token);
      if (userRights === 'user') throw new ProhibitedError('You have no rights to see these order details');
    }

    const orders = await Order.findAll({
      where: { userId: req.userId },
      attributes: {
        exclude: [...timestampsKeys]
      },
    });


    const resBody: OrderDTS[] = orders.map(order => {
      return {
        id: order.id,
        deliverAt: order.deliverAt.toISOString(),
        status: order.status,
        totalCost: order.totalCost,
        archiveAddress: order.archiveAddress,
        customerName: order.customerName,
        customerPhonenumber: order.customerPhonenumber,
        facilityId: order.facilityId
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

orderRouter.get(
  '/:id',
  middleware.verifyToken,
  middleware.userCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    const order = await Order.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: OrderFood,
          as: 'orderFoods',
          include: [
            {
              model: Food,
              as: 'food',
              attributes: {
                exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', ...timestampsKeys]
              },
              include: [
                includeNameLocNoTimestamps
              ]
            }
          ]
        },
        {
          model: Facility,
          as: 'facility',
          attributes: {
            exclude: ['descriptionLocId', 'addressId', ...timestampsKeys]
          },
          include: [
            includeNameLocNoTimestamps
          ]
        }
      ]
    });
    if (!order) throw new DatabaseError(`No order entry with this id ${req.params.id}`);

    // Check if user attempts to get other user's order info. Permitted for managers and admins
    if (order.userId !== req.userId) {
      const userRights = await Session.getUserRightsCache(req.token);
      if (userRights === 'user') throw new ProhibitedError('You have no rights to see this order details');
    }

    const resBody: OrderDT = {
      id: order.id,
      deliverAt: order.deliverAt.toISOString(),
      status: order.status,
      totalCost: order.totalCost,
      archiveAddress: order.archiveAddress,
      customerName: order.customerName,
      customerPhonenumber: order.customerPhonenumber,
      orderFoods: order.orderFoods!.map(orderFood => {
        const orderFoodDT: OrderFoodDT = {
          food: {
            nameLoc: mapDataToTransit(orderFood.food!.nameLoc!),
            ...mapDataToTransit(orderFood.food!.dataValues)
          },
          ...mapDataToTransit(orderFood.dataValues)
        };
        return orderFoodDT;
      }),
      facility: {
        id: order.facility!.id,
        nameLoc: mapDataToTransit(order.facility!.nameLoc!)
      }
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);


orderRouter.post(
  '/',
  (async (req, res) => {

    let userId: number | null = null;


    // Optional user id extraction makes below useful for unauthorized users as well as authorized ones
    if (req.cookies.token) {
      const token = req.cookies.token as string;
  
      const payload = jwt.verify(token, config.SECRET);
  
      if (typeof payload === "string" || payload instanceof String || !isCustomPayload(payload))
        throw new AuthorizationError('Malformed token');

      userId = Number(payload.id);
    }


    if (!isNewOrderBody(req.body)) throw new RequestBodyError('Invalid new order request body');

    const { deliverAt, address, newAddress, orderFoods, customerName, customerPhonenumber, facilityId } = req.body;

    const facility = await Facility.findByPk(facilityId, {
      attributes: {
        exclude: ['descriptionLocId', 'addressId', ...timestampsKeys]
      },
      include: [
        includeNameLocNoTimestamps
      ]
    });
    if (!facility) throw new DatabaseError(`No facility entry with this id ${facilityId}`);

    const addressId = address ? address.id : null;

    const addressInfo = address ? address : newAddress;


    let archiveAddress: string = '';
    archiveAddress = addressInfo?.region ?          archiveAddress + addressInfo.region + ' ' : archiveAddress;
    archiveAddress = addressInfo?.regionDistrict ?  archiveAddress + addressInfo?.regionDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.city + ' ';
    archiveAddress = addressInfo?.cityDistrict ?    archiveAddress + addressInfo?.cityDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.street + ' ';
    archiveAddress = addressInfo?.house ?           archiveAddress + addressInfo?.house + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entrance ?        archiveAddress + addressInfo?.entrance + ' ' : archiveAddress;
    archiveAddress = addressInfo?.floor ?           archiveAddress + addressInfo?.floor + ' ' : archiveAddress;
    archiveAddress = addressInfo?.flat ?            archiveAddress + addressInfo?.flat + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entranceKey ?     archiveAddress + addressInfo?.entranceKey : archiveAddress;

    archiveAddress = archiveAddress.trim();


    let totalCost: number = 0;
    const orderFoodsWithDBFoods = [] as {
      orderFood: NewOrderFood,
      foodInDB: Food
    }[];

    for (const orderFood of orderFoods) {
      const food = await Food.findByPk(orderFood.foodId, {
        attributes: {
          exclude: [...timestampsKeys]
        },
        include: [
          includeNameLocNoTimestamps
        ]
      });
      if (!food) throw new DatabaseError(`No food entry with this id ${orderFood.foodId}`);

      totalCost += food.price * orderFood.amount;

      orderFoodsWithDBFoods.push({
        orderFood,
        foodInDB: food
      });
    }

    // totalCost = Math.round(totalCost * 100) / 100; // Any round you like
    totalCost = Math.round(totalCost);

    // Also add your delivery cost computations here

    // Also apply your discount system here

    // Also facility Stock can be recalculated here

    const savedOrder = await Order.create({
      deliverAt: new Date(deliverAt),
      status: 'accepted',
      totalCost,
      archiveAddress,
      addressId,
      userId,
      customerName,
      customerPhonenumber,
      facilityId
    });


    const savedOrderFoodsWithFoodInfo = [] as {
      savedOrderFood: OrderFood,
      food: Food
    }[];

    for (const orderFoodWithDBFood of orderFoodsWithDBFoods) {
      const savedOrderFood = await OrderFood.create({
        orderId: savedOrder.id,
        foodId: orderFoodWithDBFood.foodInDB.id,
        amount: orderFoodWithDBFood.orderFood.amount,
        archivePrice: orderFoodWithDBFood.foodInDB.price,
        archiveFoodName: orderFoodWithDBFood.foodInDB.nameLoc!.mainStr
      });
      savedOrderFoodsWithFoodInfo.push({
        savedOrderFood,
        food: orderFoodWithDBFood.foodInDB
      });
    }


    const resBody: OrderDT = {
      id: savedOrder.id,
      deliverAt: savedOrder.deliverAt.toISOString(),
      status: savedOrder.status,
      totalCost: savedOrder.totalCost,
      archiveAddress: savedOrder.archiveAddress,
      customerName: savedOrder.customerName,
      customerPhonenumber: savedOrder.customerPhonenumber,
      orderFoods: savedOrderFoodsWithFoodInfo.map(savedInfo => {
        const orderFood: OrderFoodDT = {
          food: {
            nameLoc: mapDataToTransit(savedInfo.food.nameLoc!),
            ...mapDataToTransit(savedInfo.food.dataValues)
          },
          ...mapDataToTransit(savedInfo.savedOrderFood.dataValues)
        };
        return orderFood;
      }),
      facility: {
        id: facility.id,
        nameLoc: mapDataToTransit(facility.nameLoc!)
      }
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

orderRouter.put(
  '/:id/status',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditOrderStatusBody(req.body)) throw new RequestBodyError('Invalid edit order request body');

    const updOrder = await Order.findByPk(req.params.id);
    if (!updOrder) throw new DatabaseError(`No order entry with this id ${req.params.id}`);


    const { status } = req.body;

    updOrder.status = status;

    await updOrder.save();


    const resBody: OrderDTS = {
      id: updOrder.id,
      deliverAt: updOrder.deliverAt.toISOString(),
      status: updOrder.status,
      totalCost: updOrder.totalCost,
      archiveAddress: updOrder.archiveAddress,
      customerName: updOrder.customerName,
      customerPhonenumber: updOrder.customerPhonenumber,
      facilityId: updOrder.facilityId
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

/**
 * PUT route for orders is supplementary for rare cases, can be used by managers
 * Rewrites all OrderFoods for this Order, changes all fields for the case if user made a mistake
 */
orderRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditOrderBody(req.body)) throw new RequestBodyError('Invalid edit order request body');

    const updOrder = await Order.findByPk(req.params.id);
    if (!updOrder) throw new DatabaseError(`No order entry with this id ${req.params.id}`);

    // Delete all order food info to use updated ones
    await OrderFood.destroy({ where: { orderId: req.params.id } });


    const { deliverAt, address, newAddress, orderFoods, customerName, customerPhonenumber, facilityId } = req.body;

    const facility = await Facility.findByPk(facilityId, {
      attributes: {
        exclude: ['descriptionLocId', 'addressId', ...timestampsKeys]
      },
      include: [
        includeNameLocNoTimestamps
      ]
    });
    if (!facility) throw new DatabaseError(`No facility entry with this id ${facilityId}`);

    const addressId = address ? address.id : null;

    const addressInfo = address ? address : newAddress;


    let archiveAddress: string = '';
    archiveAddress = addressInfo?.region ?          archiveAddress + addressInfo.region + ' ' : archiveAddress;
    archiveAddress = addressInfo?.regionDistrict ?  archiveAddress + addressInfo?.regionDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.city + ' ';
    archiveAddress = addressInfo?.cityDistrict ?    archiveAddress + addressInfo?.cityDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.street + ' ';
    archiveAddress = addressInfo?.house ?           archiveAddress + addressInfo?.house + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entrance ?        archiveAddress + addressInfo?.entrance + ' ' : archiveAddress;
    archiveAddress = addressInfo?.floor ?           archiveAddress + addressInfo?.floor + ' ' : archiveAddress;
    archiveAddress = addressInfo?.flat ?            archiveAddress + addressInfo?.flat + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entranceKey ?     archiveAddress + addressInfo?.entranceKey : archiveAddress;

    archiveAddress = archiveAddress.trim();


    let totalCost: number = 0;
    const orderFoodsWithDBFoods = [] as {
      orderFood: NewOrderFood,
      foodInDB: Food
    }[];

    for (const orderFood of orderFoods) {
      const food = await Food.findByPk(orderFood.foodId, {
        attributes: {
          exclude: [...timestampsKeys]
        },
        include: [
          includeNameLocNoTimestamps
        ]
      });
      if (!food) throw new DatabaseError(`No food entry with this id ${orderFood.foodId}`);

      totalCost += food.price * orderFood.amount;

      orderFoodsWithDBFoods.push({
        orderFood,
        foodInDB: food
      });
    }

    // totalCost = Math.round(totalCost * 100) / 100; // Any round you like
    totalCost = Math.round(totalCost);

    // Also add your delivery cost computations here

    // Also apply your discount system here

    // Also facility Stock can be recalculated here

    updOrder.addressId = addressId;
    updOrder.deliverAt = new Date(deliverAt);
    updOrder.totalCost = totalCost;
    updOrder.archiveAddress = archiveAddress;
    updOrder.customerName = customerName;
    updOrder.customerPhonenumber = customerPhonenumber;
    updOrder.facilityId = facilityId;

    await updOrder.save();


    const savedOrderFoodsWithFoodInfo = [] as {
      savedOrderFood: OrderFood,
      food: Food
    }[];

    for (const orderFoodWithDBFood of orderFoodsWithDBFoods) {
      const savedOrderFood = await OrderFood.create({
        orderId: updOrder.id,
        foodId: orderFoodWithDBFood.foodInDB.id,
        amount: orderFoodWithDBFood.orderFood.amount,
        archivePrice: orderFoodWithDBFood.foodInDB.price,
        archiveFoodName: orderFoodWithDBFood.foodInDB.nameLoc!.mainStr
      });
      savedOrderFoodsWithFoodInfo.push({
        savedOrderFood,
        food: orderFoodWithDBFood.foodInDB
      });
    }


    const resBody: OrderDT = {
      id: updOrder.id,
      deliverAt: updOrder.deliverAt.toISOString(),
      status: updOrder.status,
      totalCost: updOrder.totalCost,
      archiveAddress: updOrder.archiveAddress,
      customerName: updOrder.customerName,
      customerPhonenumber: updOrder.customerPhonenumber,
      orderFoods: savedOrderFoodsWithFoodInfo.map(savedInfo => {
        const orderFood: OrderFoodDT = {
          food: {
            nameLoc: mapDataToTransit(savedInfo.food.nameLoc!),
            ...mapDataToTransit(savedInfo.food.dataValues)
          },
          ...mapDataToTransit(savedInfo.savedOrderFood.dataValues)
        };
        return orderFood;
      }),
      facility: {
        id: facility.id,
        nameLoc: mapDataToTransit(facility.nameLoc!)
      }
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);


export default orderRouter;