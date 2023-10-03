import type { RequestHandler } from 'express';
import type { FacilityDT, NewAddressBody, StockDT, EditStock, NewStock } from '@m-cafe-app/utils';
import { Router } from 'express';
import middleware from '../utils/middleware.js';
import {
  Address,
  Facility,
  FacilityManager,
  Ingredient,
  LocString,
  Stock,
  User,
  UserAddress
} from '@m-cafe-app/db';
import {
  isNewFacilityBody,
  mapDataToTransit,
  RequestBodyError,
  DatabaseError,
  updateInstance,
  isEditFacilityBody,
  isNumber,
  UnknownError,
  isEditStockBody,
  ProhibitedError,
  hasOwnProperty
} from '@m-cafe-app/utils';
import { timestampsKeys } from '@m-cafe-app/shared-constants';
import {
  includeNameDescriptionLocNoTimestamps,
  includeNameLocNoTimestamps,
  includeStockMeasureLocNoTimestamps
} from '../utils/sequelizeHelpers.js';
import { isRequestCustom } from '../types/RequestCustom.js';
import { Session } from '../redis/Session.js';


const facilityRouter = Router();

facilityRouter.get(
  '/',
  (async (req, res) => {

    const facilities = await Facility.findAll({
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Address,
          as: 'address',
          attributes: {
            exclude: [...timestampsKeys]
          },
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    const resBody: FacilityDT[] = facilities.map(facility => {
      return {
        id: facility.id,
        nameLoc: mapDataToTransit(facility.nameLoc!.dataValues),
        descriptionLoc: mapDataToTransit(facility.descriptionLoc!.dataValues),
        address: mapDataToTransit(facility.address!.dataValues)
      };
    });

    res.status(200).json(resBody);

  }) as RequestHandler
);

facilityRouter.get(
  '/:id/managers',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    const facility = await Facility.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Address,
          as: 'address',
          attributes: {
            exclude: [...timestampsKeys]
          },
        },
        {
          model: User,
          as: 'managers',
          required: false,
          attributes: {
            exclude: ['passwordHash', ...timestampsKeys]
          },
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    if (!facility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const resBody: FacilityDT = {
      id: facility.id,
      nameLoc: mapDataToTransit(facility.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(facility.descriptionLoc!.dataValues),
      address: mapDataToTransit(facility.address!.dataValues),
      managers: facility.managers?.map(manager => mapDataToTransit(manager.dataValues))
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);


facilityRouter.get(
  '/:id/stocks',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    const facilityManager = await FacilityManager.findOne({ where: { facilityId: req.params.id, userId: req.userId } });
    if (!facilityManager) {
      const userRights = await Session.getUserRightsCache(req.token);
      if (userRights !== 'admin') // <-- Admin is permitted to get any facility's stock
        throw new ProhibitedError('You are not a manager of this facility. Contact admins to solve this problem');
    }

    const facility = await Facility.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Address,
          as: 'address',
          attributes: {
            exclude: [...timestampsKeys]
          },
        },
        {
          model: Stock,
          as: 'stocks',
          attributes: {
            exclude: ['facilityId', ...timestampsKeys]
          },
          include: [
            {
              model: Ingredient,
              as: 'ingredient',
              attributes: {
                exclude: [...timestampsKeys]
              },
              include: [
                includeNameLocNoTimestamps,
                includeStockMeasureLocNoTimestamps
              ]
            }
          ]
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    if (!facility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const resBody: FacilityDT = {
      id: facility.id,
      nameLoc: mapDataToTransit(facility.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(facility.descriptionLoc!.dataValues),
      address: mapDataToTransit(facility.address!.dataValues),
      stocks: facility.stocks?.map(stock => mapDataToTransit(stock.dataValues))
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);


// Is it needed at all?
facilityRouter.get(
  '/:id',
  middleware.requestParamsCheck,
  (async (req, res) => {

    const facility = await Facility.findByPk(req.params.id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Address,
          as: 'address',
          attributes: {
            exclude: [...timestampsKeys]
          },
        },
        ...includeNameDescriptionLocNoTimestamps
      ]
    });

    if (!facility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const resBody: FacilityDT = {
      id: facility.id,
      nameLoc: mapDataToTransit(facility.nameLoc!.dataValues),
      descriptionLoc: mapDataToTransit(facility.descriptionLoc!.dataValues),
      address: mapDataToTransit(facility.address!.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

facilityRouter.post(
  '/:id/managers',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!req.body.userId || !isNumber(req.body.userId)) throw new RequestBodyError('Invalid add facility manager request query');

    const foundFacility = await Facility.findByPk(req.params.id);
    if (!foundFacility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const foundUser = await User.findByPk(req.body.userId as number);
    if (!foundUser) throw new DatabaseError(`No user entry with this id ${req.body.userId as number}`);

    if (foundUser.rights !== 'manager' || foundUser.rights !== 'admin') {
      foundUser.rights = 'manager';
      await foundUser.save();
    }

    await FacilityManager.create({
      facilityId: foundFacility.id,
      userId: foundUser.id
    });

    res.status(201).end();

  }) as RequestHandler
);

facilityRouter.post(
  '/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isNewFacilityBody(req.body)) throw new RequestBodyError('Invalid add facility request body');

    const { nameLoc, descriptionLoc, address } = req.body;

    const savedNameLoc = await LocString.create(nameLoc);
    const savedDescriptionLoc = await LocString.create(descriptionLoc);

    const newAddress: NewAddressBody = { city: address.city, street: address.street };
    
    if (address.cityDistrict) newAddress.cityDistrict = address.cityDistrict;
    if (address.region) newAddress.region = address.region;
    if (address.regionDistrict) newAddress.regionDistrict = address.regionDistrict;
    if (address.house) newAddress.house = address.house;
    if (address.entrance) newAddress.entrance = address.entrance;
    if (address.floor) newAddress.floor = address.floor;
    if (address.flat) newAddress.flat = address.flat;
    if (address.entranceKey) newAddress.entranceKey = address.entranceKey;

    const [savedAddress, _created] = await Address.findOrCreate({
      where: { ...newAddress }
    });

    const savedFacility = await Facility.create({
      nameLocId: savedNameLoc.id,
      descriptionLocId: savedDescriptionLoc.id,
      addressId: savedAddress.id
    });

    const resBody: FacilityDT = {
      id: savedFacility.id,
      nameLoc: mapDataToTransit(savedNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(savedDescriptionLoc.dataValues),
      address: mapDataToTransit(savedAddress.dataValues)
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

facilityRouter.put(
  '/:id/stocks',
  middleware.verifyToken,
  middleware.managerCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isEditStockBody(req.body)) throw new RequestBodyError('Invalid update stock request body');

    const facilityManager = await FacilityManager.findOne({ where: { facilityId: req.params.id, userId: req.userId } });
    if (!facilityManager) {
      const userRights = await Session.getUserRightsCache(req.token);
      if (userRights !== 'admin') // <-- Admin is permitted to upd any facility's stock
        throw new ProhibitedError('You are not a manager of this facility. Contact admins to solve this problem');
    }

    const stockFacility = await Facility.findByPk(req.params.id);
    if (!stockFacility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const { stocksUpdate } = req.body;

    const responseStocks: StockDT[] = [];

    for (const stock of stocksUpdate ) {

      if (hasOwnProperty(stock, 'id')) {

        const updStock = stock as EditStock;
        const stockInDB = await Stock.findByPk(updStock.id);
        if (!stockInDB) throw new DatabaseError(`No stock entry with this id ${updStock.id}. This should not be reached, check frontend`);
        stockInDB.amount = updStock.amount;
        await stockInDB.save();

        responseStocks.push(stockInDB.dataValues);

      } else {

        const newStock = stock as NewStock;
        const ingredientInDB = await Ingredient.findByPk(newStock.ingredientId);
        if (!ingredientInDB) throw new DatabaseError(`No ingredient entry with this id ${newStock.ingredientId}`);
        const stockInDB = await Stock.create({
          facilityId: stockFacility.id,
          ingredientId: ingredientInDB.id,
          amount: newStock.amount
        });

        responseStocks.push(stockInDB.dataValues);

      }
    }

    res.status(200).json(responseStocks);

  }) as RequestHandler
);

facilityRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isEditFacilityBody(req.body)) throw new RequestBodyError('Invalid add facility request body');

    const { nameLoc, descriptionLoc, address } = req.body;

    const updFacility = await Facility.findByPk(req.params.id);
    if (!updFacility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const updNameLoc = await LocString.findOne({ where: { id: nameLoc.id } });
    if (!updNameLoc) throw new DatabaseError(`No localization entry with this id ${nameLoc.id}`);

    const updDescriptionLoc = await LocString.findOne({ where: { id: descriptionLoc.id } });
    if (!updDescriptionLoc) throw new DatabaseError(`No localization entry with this id ${descriptionLoc.id}`);

    const oldAddress = await Address.findByPk(updFacility.addressId);
    if (!oldAddress) throw new DatabaseError(`No address entry with this id ${updFacility.addressId}. This error here should not ever happen`);

    const [savedAddress, _created] = await Address.findOrCreate({
      where: { ...address }
    });

    updateInstance(updNameLoc, nameLoc);
    updateInstance(updDescriptionLoc, descriptionLoc);

    await updNameLoc.save();
    await updDescriptionLoc.save();

    updFacility.addressId = savedAddress.id;

    await updFacility.save();


    if (oldAddress.id !== savedAddress.id) {
      const addressUser = await UserAddress.findOne({
        where: {
          addressId: oldAddress.id
        }
      });
      const addressFacility = await Facility.findOne({
        where: {
          addressId: oldAddress.id
        }
      });

      if (!addressUser && !addressFacility) await oldAddress.destroy();
    }


    const resBody: FacilityDT = {
      id: updFacility.id,
      nameLoc: mapDataToTransit(updNameLoc.dataValues),
      descriptionLoc: mapDataToTransit(updDescriptionLoc.dataValues),
      address: mapDataToTransit(savedAddress.dataValues)
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

facilityRouter.delete(
  '/:id/managers/:userId',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    const foundFacility = await Facility.findByPk(req.params.id);
    if (!foundFacility) throw new DatabaseError(`No facility entry with this id ${req.params.id}`);

    const foundUser = await User.findByPk(req.params.userId);
    if (!foundUser) throw new DatabaseError(`No user entry with this id ${req.params.userId}`);

    if (foundUser.rights === 'manager') {
      foundUser.rights = 'customer';
      await foundUser.save();
    }

    await FacilityManager.destroy({ where: 
      {
        facilityId: foundFacility.id,
        userId: foundUser.id
      }
    });

    res.status(204).end();

  }) as RequestHandler
);

facilityRouter.delete(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await Facility.destroy({ where: { id: req.params.id } });

    res.status(204).end();

  }) as RequestHandler
);

export default facilityRouter;