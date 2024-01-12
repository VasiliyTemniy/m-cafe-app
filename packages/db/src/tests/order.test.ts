import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { FacilityType, MassMeasure, OrderStatus, SizingMeasure } from '@m-market-app/shared-constants';
import { createAddress, createCustomer, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Order model tests', () => {

  let facilityAddress: InstanceType<typeof dbHandler.models.Address>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let facility: InstanceType<typeof dbHandler.models.Facility>;
  let user: InstanceType<typeof dbHandler.models.User>;
  let userAddress: InstanceType<typeof dbHandler.models.Address>;

  const pickedDeliveryType = randomEnumValue('OrderDeliveryType');
  const pickedOrderStatus = randomEnumValue('OrderStatus');
  const pickedPaymentMethod = randomEnumValue('OrderPaymentMethod');
  const pickedPaymentStatus = randomEnumValue('OrderPaymentStatus');
  const pickedCurrencyCode = randomEnumValue('CurrencyCode');


  before(async () => {
    await dbHandler.pingDb();

    ({ address: facilityAddress } = await createAddress(dbHandler));

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: FacilityType.Catering
    });

    ({ customer: user } = await createCustomer(dbHandler));

    userAddress = await dbHandler.models.Address.create({
      city: 'тест2',
      street: 'тест2'
    });
  });

  beforeEach(async () => {
    await dbHandler.models.Order.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Order.destroy({ force: true, where: {} });
    await dbHandler.models.Address.destroy({ force: true, where: {} });
    await dbHandler.models.Facility.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Order creation test', async () => {
    
    // Minimum data
    const order = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: pickedDeliveryType,
      status: pickedOrderStatus,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: pickedCurrencyCode,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: pickedPaymentMethod,
      paymentStatus: pickedPaymentStatus,
    });

    expect(order).to.exist;

    // Full data
    const order2 = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: pickedDeliveryType,
      status: pickedOrderStatus,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: pickedCurrencyCode,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: pickedPaymentMethod,
      paymentStatus: pickedPaymentStatus,
      boxSizingX: 10,
      boxSizingY: 10,
      boxSizingZ: 10,
      sizingMeasure: SizingMeasure.Cm,
      userId: user.id,
      addressId: userAddress.id,
      deliverAt: new Date(),
      recievedAt: new Date(),
      massControlValue: 10,
      massMeasure: MassMeasure.G,
      comment: 'тест',
      trackingCode: 'тест',
    });

    expect(order2).to.exist;

  });

  it('Order update test', async () => {
    
    const order = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: pickedDeliveryType,
      status: pickedOrderStatus,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: pickedCurrencyCode,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: pickedPaymentMethod,
      paymentStatus: pickedPaymentStatus,
    });

    order.status = OrderStatus.Delivered;

    await order.save();

    const orderInDB = await dbHandler.models.Order.findByPk(order.id);

    expect(orderInDB?.status).to.equal(OrderStatus.Delivered);

  });

  it('Order delete test', async () => {
    
    const order = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: pickedDeliveryType,
      status: pickedOrderStatus,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: pickedCurrencyCode,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: pickedPaymentMethod,
      paymentStatus: pickedPaymentStatus,
    });

    await order.destroy();

    const orderInDB = await dbHandler.models.Order.findByPk(order.id);

    expect(orderInDB).to.not.exist;

  });

  it('Order default scope test: does not include timestamps', async () => {
    
    const order = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: pickedDeliveryType,
      status: pickedOrderStatus,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: pickedCurrencyCode,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: pickedPaymentMethod,
      paymentStatus: pickedPaymentStatus,
    });

    const orderInDB = await dbHandler.models.Order.findOne({ where: { id: order.id } });

    expect(orderInDB?.createdAt).to.not.exist;
    expect(orderInDB?.updatedAt).to.not.exist;

  });

});