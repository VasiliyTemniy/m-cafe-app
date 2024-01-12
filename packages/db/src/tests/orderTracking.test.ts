import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import {
  CurrencyCode,
  FacilityType,
  OrderDeliveryType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
  OrderTrackingStatus
} from '@m-market-app/shared-constants';
import { createAddress, createOrgAdminManager } from './db_test_helper';



describe('Database OrderTracking model tests', () => {

  let facilityAddress: InstanceType<typeof dbHandler.models.Address>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let facility: InstanceType<typeof dbHandler.models.Facility>;
  let order: InstanceType<typeof dbHandler.models.Order>;
  let carrier: InstanceType<typeof dbHandler.models.Carrier>;

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

    order = await dbHandler.models.Order.create({
      facilityId: facility.id,
      estimatedDeliveryAt: new Date(),
      deliveryType: OrderDeliveryType.HomeDelivery,
      status: OrderStatus.Accepted,
      totalCost: 100,
      totalCuts: 10,
      totalBonusCuts: 10,
      totalBonusGains: 0,
      deliveryCost: 10,
      currencyCode: CurrencyCode.USD,
      archiveAddress: 'тест',
      customerName: 'тест',
      customerPhonenumber: 'тест',
      paymentMethod: OrderPaymentMethod.Card,
      paymentStatus: OrderPaymentStatus.Paid,
    });

    carrier = await dbHandler.models.Carrier.create({
      name: 'test',
      description: 'test',
    });
  });

  beforeEach(async () => {
    await dbHandler.models.OrderTracking.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OrderTracking.destroy({ force: true, where: {} });
    await dbHandler.models.Order.destroy({ force: true, where: {} });
    await dbHandler.models.Address.destroy({ force: true, where: {} });
    await dbHandler.models.Facility.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OrderTracking creation test', async () => {

    // Minimal data
    const orderTracking = await dbHandler.models.OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    // Full data
    const orderTracking2 = await dbHandler.models.OrderTracking.create({
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

    const orderTracking = await dbHandler.models.OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    orderTracking.status = OrderTrackingStatus.Ready;

    await orderTracking.save();

    const orderTrackingInDB = await dbHandler.models.OrderTracking.findOne({ where: { orderId: order.id } });

    expect(orderTrackingInDB?.status).to.equal(OrderTrackingStatus.Ready);

  });

  it('OrderTracking delete test', async () => {

    const orderTracking = await dbHandler.models.OrderTracking.create({
      orderId: order.id,
      facilityId: facility.id,
      status: OrderTrackingStatus.Prepared,
      pointNumber: 0,
      estimatedDeliveryAt: new Date(),
    });

    expect(orderTracking).to.exist;

    await orderTracking.destroy();

    const orderTrackingInDB = await dbHandler.models.OrderTracking.findOne({ where: { orderId: order.id } });

    expect(orderTrackingInDB).to.not.exist;
  });

});