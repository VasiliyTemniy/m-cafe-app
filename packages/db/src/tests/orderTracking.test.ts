import { expect } from 'chai';
import 'mocha';
import { Address, Facility, Order, User, OrderProduct, OrderTracking, Carrier } from '../models';
import { dbHandler } from '../db';
import {
  FacilityType,
  OrderDeliveryType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
  OrderTrackingStatus
} from '@m-cafe-app/shared-constants';



describe('Database OrderTracking model tests', () => {

  let facilityAddress: Address;
  let facility: Facility;
  let user: User;
  let userAddress: Address;
  let order: Order;
  let carrier: Carrier;

  before(async () => {
    await dbHandler.pingDb();

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });

    facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: FacilityType.Catering
    });

    user = await User.create({
      lookupHash: 'testlonger',
      phonenumber: '123123123',
    });

    userAddress = await Address.create({
      city: 'тест2',
      street: 'тест2'
    });

    order = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: OrderDeliveryType.HomeDelivery,
      status: OrderStatus.Cooking,
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: OrderPaymentMethod.Cash,
      paymentStatus: OrderPaymentStatus.Paid,
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    });

    carrier = await Carrier.create({
      name: 'test',
      contactNumbers: '123123123, 100500123123, 89944567752'
    });
  });

  beforeEach(async () => {
    await OrderTracking.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Order.destroy({ force: true, where: {} });
    await User.scope('all').destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Facility.destroy({ force: true, where: {} });
    await OrderProduct.destroy({ force: true, where: {} });
  });

  it('OrderTracking creation test', async () => {

    // Minimal data
    const orderTracking = await OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    // Full data
    const orderTracking2 = await OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Ready,
      pointNumber: 1,
      estimatedDeliveryAt: new Date(),
      massControlValue: 10,
      deliveredAt: new Date(),
      carrierId: carrier.id
    });

    expect(orderTracking2).to.exist;

  });

  it('OrderTracking update test', async () => {

    const orderTracking = await OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    orderTracking.status = OrderTrackingStatus.Ready;

    await orderTracking.save();

    const orderTrackingInDB = await OrderTracking.findOne({ where: { orderId: order.id } });

    expect(orderTrackingInDB?.status).to.equal(OrderTrackingStatus.Ready);

  });

  it('OrderTracking delete test', async () => {

    const orderTracking = await OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    await orderTracking.destroy();

    const orderTrackingInDB = await OrderTracking.findOne({ where: { orderId: order.id } });

    expect(orderTrackingInDB).to.not.exist;
  });

});