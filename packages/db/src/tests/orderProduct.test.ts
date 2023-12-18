import { expect } from 'chai';
import 'mocha';
import { Address, Facility, Order, User, OrderProduct, Product, ProductType } from '../models';
import { dbHandler } from '../db';
import { FacilityType, OrderDeliveryType, OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '@m-cafe-app/shared-constants';



describe('Database OrderProduct model tests', () => {

  let facilityAddress: Address;
  let facility: Facility;
  let user: User;
  let userAddress: Address;
  let order: Order;
  let productType: ProductType;
  let product: Product;

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

    productType = await ProductType.create({
    });

    product = await Product.create({
      price: 1,
      productTypeId: productType.id
    });
  });

  beforeEach(async () => {
    await OrderProduct.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Order.destroy({ force: true, where: {} });
    await User.scope('all').destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Facility.destroy({ force: true, where: {} });
    await OrderProduct.destroy({ force: true, where: {} });
  });

  it('OrderProduct creation test', async () => {
    
    const orderProduct = await OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archiveProductPrice: 1,
      archiveProductName: 'тест'
    });

    expect(orderProduct).to.exist;

  });

  it('OrderProduct update test', async () => {
    
    const orderProduct = await OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archiveProductPrice: 1,
      archiveProductName: 'тест'
    });

    orderProduct.quantity = 2;
    orderProduct.archiveProductPrice = 2;
    orderProduct.archiveProductName = 'тест2';

    await orderProduct.save();

    const orderProductInDB = await OrderProduct.findOne({ where: { orderId: order.id, archiveProductId: product.id } });

    expect(orderProductInDB?.quantity).to.equal(2);
    expect(orderProductInDB?.archiveProductPrice).to.equal(2);
    expect(orderProductInDB?.archiveProductName).to.equal('тест2');

  });

  it('OrderProduct delete test', async () => {
    
    const orderProduct = await OrderProduct.create({
      orderId: order.id,
      productId: product.id,
      archiveProductId: product.id,
      quantity: 1,
      archiveProductPrice: 1,
      archiveProductName: 'тест'
    });

    await orderProduct.destroy();

    const orderProductInDB = await OrderProduct.findOne({ where: { orderId: order.id, archiveProductId: product.id } });

    expect(orderProductInDB).to.not.exist;

  });

});