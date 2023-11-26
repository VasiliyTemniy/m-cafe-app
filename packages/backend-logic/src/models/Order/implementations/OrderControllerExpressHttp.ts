import type { IOrderControllerExpressHttp, IOrderService } from '../interfaces';
import type { Request, Response } from 'express';
import type { IUserService } from '../../User';
import type { IFacilityService } from '../../Facility';
import type { OrderDT } from '@m-cafe-app/models';
import {
  ApplicationError,
  ProhibitedError,
  RequestBodyError,
  RequestQueryError,
  UnknownError,
  isString
} from '@m-cafe-app/utils';
import { isRequestCustom } from '../../../utils';
import { isOrderDTN, isOrderDTU } from '@m-cafe-app/models';
import {
  NumericToOrderStatusMapping,
  NumericToOrderPaymentMethodMapping,
  NumericToOrderPaymentStatusMapping,
  OrderStatus,
  OrderPaymentMethod,
  OrderPaymentStatus,
} from '@m-cafe-app/shared-constants';
import type { ParsedQs } from 'qs';


export class OrderControllerExpressHttp implements IOrderControllerExpressHttp {
  constructor (
    readonly orderService: IOrderService,
    readonly userService: IUserService,
    readonly facilityService: IFacilityService
  ) {}

  private async checkRequestAuth(req: Request): Promise<void> {
    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    const userRights = req.rights;

    // Admin can see all
    if (userRights === 'admin') {
      return;
    }

    // Manager can see all orders of his facility
    if (userRights === 'manager') {
      if (!req.query.facilityid) {
        throw new ProhibitedError('You have to be an admin to see all orders');
      }

      const isFacilityManager = await this.facilityService.checkFacilityManager(req.userId, Number(req.query.facilityid));
      if (!isFacilityManager) {
        throw new ProhibitedError('You are not a manager of this facility');
      }
      return;
    }

    if (userRights === 'customer') {
      // Check if customer attempts to get other user's order info
      if (!req.query.userId || Number(req.query.userId) !== req.userId) {
        throw new ProhibitedError('You have no rights to see these order details');
      }
      return;
    }

    throw new ApplicationError('Unknown user rights');
  }

  /**
   * Checks and retrieves enum from query key (numeric string) with mapping
   * @param key 
   * @param mapping 
   * @returns 
   */
  private getEnumFromQuery<T, U extends { [key: string]: T }>(
    key: ParsedQs[string],
    mapping: U
  ): T | undefined {
    if (isNaN(Number(key)) ||
      !isString(key) ||
      Number(key) < 0 ||
      Number(key) > Object.keys(mapping).length
    ) {
      throw new RequestQueryError('Incorrect query string');
    }
    return mapping[key];
  }

  async getAll(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    const orders = await this.orderService.getAll();
    res.status(200).json(orders);
  }

  async getById(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    const order = await this.orderService.getById(Number(req.params.id));
    res.status(200).json(order);
  }

  async getSome(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    let userId: number | undefined = undefined;
    let status: OrderStatus | undefined = undefined;
    let facilityId: number | undefined = undefined;
    let paymentMethod: OrderPaymentMethod | undefined = undefined;
    let paymentStatus: OrderPaymentStatus | undefined = undefined;

    if (req.query.limit) {
      if (isNaN(Number(req.query.limit))) throw new RequestQueryError('Incorrect query string');
      limit = Number(req.query.limit);
    }

    if (req.query.offset) {
      if (isNaN(Number(req.query.offset))) throw new RequestQueryError('Incorrect query string');
      offset = Number(req.query.offset);
    }

    if (req.query.userId) {
      if (isNaN(Number(req.query.userId))) throw new RequestQueryError('Incorrect query string');
      userId = Number(req.query.userId);
    }

    if (req.query.status) {
      // Delete this later after checks for correctness of a generic method
      //
      // if (isNaN(Number(req.query.status)) ||
      //   !isString(req.query.status) ||
      //   Number(req.query.status) < 0 ||
      //   Number(req.query.status) > Object.keys(OrderStatus).length
      // ) {
      //   throw new RequestQueryError('Incorrect query string');
      // }
      // status = NumericToOrderStatusMapping[req.query.status];
      status = this.getEnumFromQuery<OrderStatus, typeof NumericToOrderStatusMapping>(
        req.query.status, NumericToOrderStatusMapping
      );
    }

    if (req.query.facilityId) {
      if (isNaN(Number(req.query.facilityId))) throw new RequestQueryError('Incorrect query string');
      facilityId = Number(req.query.facilityId);
    }

    if (req.query.paymentMethod) {
      // Delete this later after checks for correctness of a generic method
      //
      // if (isNaN(Number(req.query.paymentMethod)) ||
      //   !isString(req.query.paymentMethod) ||
      //   Number(req.query.paymentMethod) < 0 ||
      //   Number(req.query.paymentMethod) > Object.keys(OrderPaymentMethod).length
      // ) {
      //   throw new RequestQueryError('Incorrect query string');
      // }
      // paymentMethod = NumericToOrderPaymentMethodMapping[req.query.paymentMethod];
      paymentMethod = this.getEnumFromQuery<OrderPaymentMethod, typeof NumericToOrderPaymentMethodMapping>(
        req.query.paymentMethod, NumericToOrderPaymentMethodMapping
      );
    }

    if (req.query.paymentStatus) {
      // Delete this later after checks for correctness of a generic method
      //
      // if (isNaN(Number(req.query.paymentStatus)) ||
      //   !isString(req.query.paymentStatus) ||
      //   Number(req.query.paymentStatus) < 0 ||
      //   Number(req.query.paymentStatus) > Object.keys(OrderPaymentStatus).length
      // ) {
      //   throw new RequestQueryError('Incorrect query string');
      // }
      // paymentStatus = NumericToOrderPaymentStatusMapping[req.query.paymentStatus];
      paymentStatus = this.getEnumFromQuery<OrderPaymentStatus, typeof NumericToOrderPaymentStatusMapping>(
        req.query.paymentStatus, NumericToOrderPaymentStatusMapping
      );
    }

    const orders = await this.orderService.getSome(limit, offset, userId, status, facilityId, paymentMethod, paymentStatus);
    res.status(200).json(orders);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!isOrderDTN(req.body)) throw new RequestBodyError('Invalid new order request body');

    const {
      deliverAt,
      user,
      address,
      orderFoods,
      customerName,
      customerPhonenumber,
      facility,
      paymentMethod,
      tablewareQuantity,
      comment
    } = req.body;

    const newOrder: OrderDT = await this.orderService.create({
      deliverAt,
      user,
      address,
      orderFoods,
      customerName,
      customerPhonenumber,
      facility,
      paymentMethod,
      tablewareQuantity,
      comment
    });

    res.status(201).json(newOrder);
  }

  async update(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    if (!isOrderDTU(req.body)) throw new RequestBodyError('Invalid edit order request body');

    const {
      deliverAt,
      status,
      user,
      address,
      orderFoods,
      customerName,
      customerPhonenumber,
      facility,
      paymentStatus,
      paymentMethod,
      tablewareQuantity,
      comment
    } = req.body;

    const updatedOrder: OrderDT = await this.orderService.update({
      id: Number(req.params.id),
      status,
      deliverAt,
      user,
      address,
      orderFoods,
      customerName,
      customerPhonenumber,
      facility,
      paymentStatus,
      paymentMethod,
      tablewareQuantity,
      comment
    });

    res.status(200).json(updatedOrder);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);
    
    // if (!req.query.status ||
    //   isNaN(Number(req.query.status)) ||
    //   !isString(req.query.status) ||
    //   Number(req.query.status) < 0 ||
    //   Number(req.query.status) > Object.keys(OrderStatus).length
    // ) {
    //   throw new RequestBodyError('Invalid edit order status request body');
    // }

    // const status = NumericToOrderStatusMapping[req.query.status];

    const status = this.getEnumFromQuery<OrderStatus, typeof NumericToOrderStatusMapping>(
      req.query.status, NumericToOrderStatusMapping
    );

    const paymentStatus = this.getEnumFromQuery<OrderPaymentStatus, typeof NumericToOrderPaymentStatusMapping>(
      req.query.paymentStatus, NumericToOrderPaymentStatusMapping
    );

    if (!status && !paymentStatus) {
      throw new RequestBodyError('Invalid edit order status request body');
    }

    const updatedOrder: OrderDT = await this.orderService.updateStatus(Number(req.params.id), status, paymentStatus);

    res.status(200).json(updatedOrder);
  }

  async remove(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    await this.orderService.remove(Number(req.params.id));
    res.status(204).end();
  }

  async removeAll(req: Request, res: Response): Promise<void> {

    await this.checkRequestAuth(req);

    await this.orderService.removeAll();
    res.status(204).end();
  }
}