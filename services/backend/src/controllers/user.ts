import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import {
  CredentialsError,
  HackError,
  PasswordLengthError,
  RequestBodyError,
  UnknownError,
  isEditUserBody,
  isNewUserBody,
  UserDT,
  isNewAddressBody,
  AddressDT,
  isEditAddressBody,
  DatabaseError,
  isNumber,
  NewAddressBody,
  EditAddressBody,
  hasOwnProperty,
  mapDataToTransit
} from '@m-cafe-app/utils';
import { isRequestCustom, isRequestWithUser } from '../types/RequestCustom.js';
import middleware from '../utils/middleware.js';
import { User, Address, Facility, UserAddress } from '../models/index.js';
import { Session } from '../redis/Session.js';
import { maxPasswordLen, minPasswordLen } from '../utils/constants.js';

const usersRouter = Router();

usersRouter.post(
  '/',
  (async (req, res) => {

    if (!isNewUserBody(req.body)) throw new RequestBodyError('Invalid new user request body');
    if (hasOwnProperty(req.body, "rights")) throw new HackError('Please do not try this');

    const { username, name, password, phonenumber, email, birthdate } = req.body;

    if (password === undefined || !(minPasswordLen < password.length && password.length < maxPasswordLen))
      throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    const user = {
      username,
      name,
      passwordHash,
      phonenumber,
      email,
      birthdate: birthdate ? new Date(birthdate) : undefined
    };

    const savedUser = await User.create(user);

    const resBody: UserDT = mapDataToTransit(savedUser.dataValues, { omit: ['passwordHash'] });

    res.status(201).json(resBody);

  }) as RequestHandler
);

usersRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');
    if (!isEditUserBody(req.body)) throw new RequestBodyError('Invalid edit user request body');
    if (req.userId !== Number(req.params.id)) throw new HackError('User attempts to change another users data or invalid user id');

    const { username, name, password, phonenumber, email, birthdate, newPassword } = req.body;

    const passwordCorrect = await bcryptjs.compare(password, req.user.passwordHash);

    if (!passwordCorrect) throw new CredentialsError('Password incorrect');

    if (username) req.user.username = username;
    if (name) req.user.name = name;
    if (phonenumber) req.user.phonenumber = phonenumber;
    if (email) req.user.email = email;
    if (birthdate) req.user.birthdate = new Date(birthdate);
    if (newPassword) {
      if (!(minPasswordLen < newPassword.length && newPassword.length < maxPasswordLen))
        throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);
      const saltRounds = 10;
      req.user.passwordHash = await bcryptjs.hash(newPassword, saltRounds);
    }

    await req.user.save();

    const resBody: UserDT = mapDataToTransit(req.user.dataValues, { omit: ['passwordHash'] });

    res.status(200).json(resBody);

  }) as RequestHandler
);


usersRouter.delete(
  '/',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');

    await Session.destroy({ where: { userId: req.user.id } });
    const deletedUser = await req.user.destroy();

    res.status(200).json(deletedUser);

  }) as RequestHandler
);


usersRouter.post(
  '/address',
  middleware.verifyToken,
  middleware.userCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isNewAddressBody(req.body)) throw new RequestBodyError('Invalid add user address request body');

    // If I do just const address = req.body, some other malformed keys can happen to go through
    const { city, street, region, district, house, entrance, floor, flat, entranceKey } = req.body;
    // If I do const address = { city, strees, region, distric, house, entrance, floor, flat, entranceKey }
    // Then where clause for existingAddress fails if one of them is undefined
    const newAddress: NewAddressBody = { city, street };
    // Combine two statements above, and you get this bulky construction
    if (region) newAddress.region = region;
    if (district) newAddress.district = district;
    if (house) newAddress.house = house;
    if (entrance) newAddress.entrance = entrance;
    if (floor) newAddress.floor = floor;
    if (flat) newAddress.flat = flat;
    if (entranceKey) newAddress.entranceKey = entranceKey;

    // Check for this address, must be unique
    // UNIQUE constraint for postgresql with NULLS NOT DISTINCT did not work - nulls blah blah was ignored by the query
    // Anyway, it did not make it to the DB after migration, and there is no such option in sequelize
    // If I make all fields not nullable and put some defaultValue like '' , validations fail for each and every of these empty strings
    // So, I decided to make this 'unique' check by hand, because I do not want to make user fill every fricking detail
    // and will leave most fields of address as nullables
    const [savedAddress, _created] = await Address.findOrCreate({
      where: { ...newAddress }
    });

    // Check if user already has this address
    const existingUserAddress = await UserAddress.findOne({
      where: {
        addressId: savedAddress.id,
        userId: req.userId
      }
    });

    const statusCode = existingUserAddress ?
      409 : 201;

    if (!existingUserAddress)
      // await req.user.addAddress(savedAddress);
      await UserAddress.create({ userId: req.userId, addressId: savedAddress.id });

    const resBody: AddressDT = mapDataToTransit(savedAddress.dataValues);

    res.status(statusCode).json(resBody);

  }) as RequestHandler
);

usersRouter.put(
  '/address/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isEditAddressBody(req.body) || !isNumber(Number(req.params.id))) throw new RequestBodyError('Invalid edit user address request body or params id');

    // check .post route for address above for explanation of this bulk
    const { city, street, region, district, house, entrance, floor, flat, entranceKey } = req.body;

    const updAddress: EditAddressBody = { city, street };

    if (region) updAddress.region = region;
    if (district) updAddress.district = district;
    if (house) updAddress.house = house;
    if (entrance) updAddress.entrance = entrance;
    if (floor) updAddress.floor = floor;
    if (flat) updAddress.flat = flat;
    if (entranceKey) updAddress.entranceKey = entranceKey;

    const oldAddressId = Number(req.params.id);
    const oldAddress = await Address.findByPk(oldAddressId);

    if (!oldAddress) throw new DatabaseError(`No address entry with this id ${oldAddressId}`);

    // Check for this address, must be unique
    const [savedAddress, _created] = await Address.findOrCreate({
      where: { ...updAddress }
    });

    // Check if user already has this new, "updated / edited" address
    const existingUserAddress = await UserAddress.findOne({
      where: {
        addressId: savedAddress.id,
        userId: req.userId
      }
    });

    const statusCode = existingUserAddress ?
      409 : 201;

    if (!existingUserAddress) {
      // await req.user.addAddress(savedAddress);
      // await req.user.removeAddress(oldAddress);
      await UserAddress.create({ userId: req.userId, addressId: savedAddress.id });
      await UserAddress.destroy({ where: { userId: req.userId, addressId: oldAddress.id } });

      // One of any is enough for check, findAll is not needed
      const addressUser = await UserAddress.findOne({
        where: {
          addressId: oldAddressId
        }
      });
      const addressFacility = await Facility.findOne({
        where: {
          addressId: oldAddressId
        }
      });

      if (!addressUser && !addressFacility) await oldAddress.destroy();
    }

    const resBody: AddressDT = mapDataToTransit(savedAddress.dataValues);

    res.status(statusCode).json(resBody);

  }) as RequestHandler
);

usersRouter.delete(
  '/address/:id',
  middleware.verifyToken,
  middleware.userCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isNumber(Number(req.params.id))) throw new RequestBodyError('Invalid delete user address params id');

    const oldAddressId = Number(req.params.id);
    const oldAddress = await Address.findByPk(oldAddressId);

    if (!oldAddress) throw new DatabaseError(`No address entry with this id ${oldAddressId}`);

    // await req.user.removeAddress(oldAddress);
    await UserAddress.destroy({ where: { userId: req.userId, addressId: oldAddress.id } });

    // One of any is enough for check, findAll is not needed
    const addressUser = await UserAddress.findOne({
      where: {
        addressId: oldAddressId
      }
    });
    const addressFacility = await Facility.findOne({
      where: {
        addressId: oldAddressId
      }
    });

    if (!addressUser && !addressFacility) await oldAddress.destroy();

    res.status(204).end();

  }) as RequestHandler
);


usersRouter.get(
  '/me',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  ((req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');

    const resBody: UserDT = mapDataToTransit(req.user.dataValues, { omit: ['passwordHash'] });

    res.status(200).json(resBody);

  }) as RequestHandler
);

export default usersRouter;