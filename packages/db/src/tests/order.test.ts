import { expect } from 'chai';
import 'mocha';
import { Address, Facility, LocString, Order, User } from '../models';
import { dbHandler } from '../db';
import { NumericToOrderPaymentMethodMapping, NumericToOrderPaymentStatusMapping, NumericToOrderStatusMapping } from '@m-cafe-app/shared-constants';



describe('Database Order model tests', () => {

  let facilityNameLoc: LocString;
  let facilityDescriptionLoc: LocString;
  let facilityAddress: Address;
  let facility: Facility;
  let user: User;
  let userAddress: Address;

  before(async () => {
    await dbHandler.pingDb();

    facilityNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    facilityDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });

    facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
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
    await LocString.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Facility.destroy({ force: true, where: {} });
  });

  it('Order creation test', async () => {
    
    const order = await Order.create({
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    });

    expect(order).to.exist;

  });

  it('Order update test', async () => {
    
    const order = await Order.create({
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    });

    order.status = NumericToOrderStatusMapping['3'];

    await order.save();

    const orderInDB = await Order.findByPk(order.id);

    expect(orderInDB?.status).to.equal(NumericToOrderStatusMapping['3']);

  });

  it('Order delete test', async () => {
    
    const order = await Order.create({
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    });

    await order.destroy();

    const orderInDB = await Order.findByPk(order.id);

    expect(orderInDB).to.not.exist;

  });

  it('Order default scope test: does not include timestamps', async () => {
    
    const order = await Order.create({
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    });

    const orderInDB = await Order.findOne({ where: { id: order.id } });

    expect(orderInDB?.createdAt).to.not.exist;
    expect(orderInDB?.updatedAt).to.not.exist;

  });

  it('Order does not get created or updated if status/paymentStatus/paymentMethod are not allowed', async () => {

    const validOrder = await Order.create({
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    });

    const invalidOrderUpdateStatusData = {
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: 'some_random_status',
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    };

    const invalidOrderUpdatePaymentStatusData = {
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: 'some_random_payment_status',
      paymentMethod: NumericToOrderPaymentMethodMapping['0'],
      tablewareQuantity: 1
    };
    
    const invalidOrderUpdatePaymentMethodData = {
      userId: user.id,
      addressId: userAddress.id,
      facilityId: facility.id,
      deliverAt: new Date(),
      status: NumericToOrderStatusMapping['0'],
      totalCost: 100,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentStatus: NumericToOrderPaymentStatusMapping['0'],
      paymentMethod: 'some_random_payment_method',
      tablewareQuantity: 1
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