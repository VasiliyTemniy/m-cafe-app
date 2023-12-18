import { expect } from 'chai';
import 'mocha';
import { Address, Facility, Order, User } from '../models';
import { dbHandler } from '../db';
import { FacilityType, NumericToOrderDeliveryTypeMapping, NumericToOrderPaymentMethodMapping, NumericToOrderPaymentStatusMapping, NumericToOrderStatusMapping } from '@m-cafe-app/shared-constants';



describe('Database Order model tests', () => {

  let facilityAddress: Address;
  let facility: Facility;
  let user: User;
  let userAddress: Address;

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
  });

  beforeEach(async () => {
    await Order.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Order.destroy({ force: true, where: {} });
    await User.scope('all').destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Facility.destroy({ force: true, where: {} });
  });

  it('Order creation test', async () => {
    
    // Minimum data
    const order = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
    });

    expect(order).to.exist;

    // Full data
    const order2 = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
      comment: 'test',
      trackingCode: 'test',
    });

    expect(order2).to.exist;

  });

  it('Order update test', async () => {
    
    const order = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    });

    order.status = NumericToOrderStatusMapping['3'];

    await order.save();

    const orderInDB = await Order.findByPk(order.id);

    expect(orderInDB?.status).to.equal(NumericToOrderStatusMapping['3']);

  });

  it('Order delete test', async () => {
    
    const order = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    });

    await order.destroy();

    const orderInDB = await Order.findByPk(order.id);

    expect(orderInDB).to.not.exist;

  });

  it('Order default scope test: does not include timestamps', async () => {
    
    const order = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    });

    const orderInDB = await Order.findOne({ where: { id: order.id } });

    expect(orderInDB?.createdAt).to.not.exist;
    expect(orderInDB?.updatedAt).to.not.exist;

  });

  it('Order does not get created or updated if status/paymentStatus/paymentMethod are not allowed', async () => {

    const validOrder = await Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    });

    const invalidOrderUpdateStatusData = {
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: 'some_random_status',
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    };

    const invalidOrderUpdatePaymentStatusData = {
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: 'some_random_status',
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      paymentStatus: 'some_random_payment_status',
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    };
    
    const invalidOrderUpdatePaymentMethodData = {
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: NumericToOrderDeliveryTypeMapping['0'],
      status: 'some_random_status',
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: 'some_random_payment_method',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      boxSizingX: 1,
      boxSizingY: 1,
      boxSizingZ: 1,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
    };

    try {
      await validOrder.update(invalidOrderUpdateStatusData as Order);
    } catch(error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.name).to.equal('SequelizeValidationError');
    }

    try {
      await validOrder.update(invalidOrderUpdatePaymentStatusData as Order);
    } catch(error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.name).to.equal('SequelizeValidationError');
    }

    try {
      await validOrder.update(invalidOrderUpdatePaymentMethodData as Order);
    } catch(error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.name).to.equal('SequelizeValidationError');
    }


    try {
      await Order.create(invalidOrderUpdateStatusData as Order);
    } catch(error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

});