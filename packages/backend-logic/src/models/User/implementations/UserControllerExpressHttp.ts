import type { IUserControllerHttp, IUserService } from '../interfaces';
import type { Request, Response } from 'express';
import type { AddressDT, UserDT } from '@m-cafe-app/models';
import type { RequestWithUserRights } from '../../../utils';
import { isRequestCustom } from '../../../utils';
import { isAddressDT, isAddressDTN, isAdministrateUserBody, isUserDTN, isUserDTU, isUserLoginDT } from '@m-cafe-app/models';
import { HackError, RequestBodyError, RequestQueryError, UnknownError, hasOwnProperty, isNumber } from '@m-cafe-app/utils';
import config from '../../../config';


export class UserControllerExpressHttp implements IUserControllerHttp {
  constructor( readonly service: IUserService ) {}

  async getAll(req: Request, res: Response) {
    const users: UserDT[] = await this.service.getAll();
    res.status(200).json(users);
  }

  async getSome(req: Request, res: Response) {

    let limit = 20;
    let offset = 0;

    if (req.query.limit) {
      if (isNaN(Number(req.query.limit))) throw new RequestQueryError('Incorrect query string');
      limit = Number(req.query.limit);
    }

    if (req.query.offset) {
      if (isNaN(Number(req.query.offset))) throw new RequestQueryError('Incorrect query string');
      offset = Number(req.query.offset);
    }

    const users: UserDT[] = await this.service.getSome(limit, offset);
    res.status(200).json(users);
  }

  async getById(req: Request, res: Response) {
    const user: UserDT = await this.service.getById(Number(req.params.id));
    res.status(200).json(user);
  }

  async getByScope(req: RequestWithUserRights, res: Response) {
    const scope = req.rights === 'admin'
      ? 'all'
      : 'nonFalsy';

    const users: UserDT[] = await this.service.getByScope(scope);
    res.status(200).json(users);
  }

  async create(req: Request, res: Response) {
    if (!isUserDTN(req.body))
      throw new RequestBodyError('Invalid new user request body');
    if (hasOwnProperty(req.body, 'rights'))
      throw new HackError('Please do not try this');

    const { username, name, password, phonenumber, email, birthdate } = req.body;

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const { user: savedUser, auth } = await this.service.create({
      username,
      name,
      password,
      phonenumber,
      email,
      birthdate
    }, userAgent);

    const resBody: UserDT = savedUser;
    
    res      
      .cookie('token', auth.token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(201).json(resBody);
  }

  async update(req: Request, res: Response) {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');
    if (!isUserDTU(req.body)) throw new RequestBodyError('Invalid edit user request body');
    if (req.userId !== Number(req.params.id)) throw new HackError('User attempts to change another users data or invalid user id');

    const { username, name, password, phonenumber, email, birthdate, newPassword } = req.body;

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const { user: updatedUser, auth } = await this.service.update({
      id: req.userId,
      username,
      name,
      phonenumber,
      email,
      birthdate,
      password,
      newPassword
    }, userAgent);

    const resBody: UserDT = updatedUser;
    
    res
      .cookie('token', auth.token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(200).json(resBody);
  }

  async administrate(req: Request, res: Response): Promise<void> {
    if (!isAdministrateUserBody(req.body)) throw new RequestBodyError('Invalid administrate user request body');

    const userSubject: UserDT = await this.service.administrate(Number(req.params.id), req.body);

    res.status(200).json(userSubject);
  }

  async login(req: Request, res: Response): Promise<void> {
    if (!isUserLoginDT(req.body))
      throw new RequestBodyError('Invalid login request body');

    const { password, phonenumber, username, email } = req.body;

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const { user, auth } = await this.service.authenticate(password, { phonenumber, username, email }, userAgent);

    const resBody: UserDT = user;

    res
      .cookie('token', auth.token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(201).json(resBody);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken and userRightsExtractor middleware');

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const auth = await this.service.refreshToken(req.token, userAgent);

    res
      .cookie('token', auth.token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(200).end();
  }

  async logout(req: Request, res: Response): Promise<void> {

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    await this.service.logout(Number(req.params.id), userAgent);
    res.clearCookie('token', config.sessionCookieOptions).status(204).end();
  }

  /**
   * Common user route for self deletedAt stamp
   */
  async remove(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    const deletedUser: UserDT = await this.service.remove(Number(req.userId));
    res.status(200).json(deletedUser);
  }

  /**
   * Admin route for deleting user with deletedAt stamp
   */
  async delete(req: Request, res: Response) {
    await this.service.delete(Number(req.params.id));
    res.status(204).end();
  }

  async createAddress(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isAddressDTN(req.body)) throw new RequestBodyError('Invalid address request body');

    const addressToCreate = req.body;

    const { address: savedAddress, created } = await this.service.createAddress(req.userId, addressToCreate);

    const statusCode = created ?
      201 : 409;

    const resBody: AddressDT = savedAddress;

    res.status(statusCode).json(resBody);
  }

  async updateAddress(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isAddressDT(req.body)) throw new RequestBodyError('Invalid address request body');

    const addressToUpdate = req.body;

    const { address: updatedAddress, updated } =
      await this.service.updateAddress(req.userId, addressToUpdate);

    const statusCode = updated ?
      200 : 409;

    const resBody: AddressDT = updatedAddress;

    res.status(statusCode).json(resBody);
  }

  async removeAddress(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');
    if (!isNumber(Number(req.params.id))) throw new RequestBodyError('Invalid delete user address params id');

    const oldAddressId = Number(req.params.id);

    await this.service.removeAddress(req.userId, oldAddressId);

    res.status(204).end();
  }

  async getWithAddress(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    const user: UserDT = await this.service.getWithAddress(Number(req.userId));
    res.status(200).json(user);
  }

  async getSelfWithAssociations(req: Request, res: Response): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    let withAddresses: boolean = false;

    if (req.query.withAddresses === 'true') {
      withAddresses = true;
    }

    if (withAddresses) {
      const user: UserDT = await this.service.getWithAddress(Number(req.userId));
      res.status(200).json(user);
    }

    const user: UserDT = await this.service.getById(Number(req.userId));
    res.status(200).json(user);
  }
}