import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { CurrencyCode, FacilityType, OrderDeliveryType, OrderPaymentMethod, OrderPaymentStatus, OrderStatus, PriceCutPermission } from '@m-cafe-app/shared-constants';
import { createAddress, createOrgAdminManager } from './db_test_helper';



describe('Database OrderProduct model tests', () => {

  let facilityAddress: InstanceType<typeof dbHandler.models.Address>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let facility: InstanceType<typeof dbHandler.models.Facility>;
  let order: InstanceType<typeof dbHandler.models.Order>;
  let productType: InstanceType<typeof dbHandler.models.ProductType>;
  let product: InstanceType<typeof dbHandler.models.Product>;

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

    productType = await dbHandler.models.ProductType.create({
      name: 'Food',
    });

    product = await dbHandler.models.Product.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      productTypeId: productType.id,
      price: 100,
      currencyCode: CurrencyCode.USD,
      priceCutPermissions: PriceCutPermission.Full,
      displayPriority: 0
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
  });

  beforeEach(async () => {
    await dbHandler.models.OrderProduct.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OrderProduct.destroy({ force: true, where: {} });
    await dbHandler.models.Product.destroy({ force: true, where: {} });
    await dbHandler.models.ProductType.destroy({ force: true, where: {} });
    await dbHandler.models.Order.destroy({ force: true, where: {} });
    await dbHandler.models.Address.destroy({ force: true, where: {} });
    await dbHandler.models.Facility.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OrderProduct creation test', async () => {
    
    const orderProduct = await dbHandler.models.OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archivePrice: 1,
      archiveName: 'тест',
      archiveTotalCuts: 1,
      archiveDiscountCuts: 1,
      archiveEventCuts: 1,
      archiveBonusCuts: 1,
      archiveBonusGains: 1
    });

    expect(orderProduct).to.exist;

  });

  it('OrderProduct update test', async () => {
    
    const orderProduct = await dbHandler.models.OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archivePrice: 1,
      archiveName: 'тест',
      archiveTotalCuts: 1,
      archiveDiscountCuts: 1,
      archiveEventCuts: 1,
      archiveBonusCuts: 1,
      archiveBonusGains: 1
    });

    orderProduct.quantity = 2;
    orderProduct.archivePrice = 2;
    orderProduct.archiveName = 'тест2';

    await orderProduct.save();

    const orderProductInDB =
      await dbHandler.models.OrderProduct.findOne({ where: { orderId: order.id, archiveProductId: product.id } });

    expect(orderProductInDB?.quantity).to.equal(2);
    expect(orderProductInDB?.archivePrice).to.equal(2);
    expect(orderProductInDB?.archiveName).to.equal('тест2');

  });

  it('OrderProduct delete test', async () => {
    
    const orderProduct = await dbHandler.models.OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archivePrice: 1,
      archiveName: 'тест',
      archiveTotalCuts: 1,
      archiveDiscountCuts: 1,
      archiveEventCuts: 1,
      archiveBonusCuts: 1,
      archiveBonusGains: 1
    });

    await orderProduct.destroy();

    const orderProductInDB =
      await dbHandler.models.OrderProduct.findOne({ where: { orderId: order.id, archiveProductId: product.id } });

    expect(orderProductInDB).to.not.exist;

  });

});