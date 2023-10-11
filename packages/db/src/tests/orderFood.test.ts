import { expect } from 'chai';
import 'mocha';
import { Address, Facility, LocString, Order, User, OrderFood, Food, FoodType } from '../models';
import { dbHandler } from '../db';



describe('Database OrderFood model tests', () => {

  let facilityNameLoc: LocString;
  let facilityDescriptionLoc: LocString;
  let facilityAddress: Address;
  let facility: Facility;
  let user: User;
  let userAddress: Address;
  let order: Order;
  let foodNameLoc: LocString;
  let foodDescriptionLoc: LocString;
  let foodType: FoodType;
  let food: Food;

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

    order = await Order.create({
      facilityId: facility.id,
      userId: user.id,
      status: 'active',
      totalCost: 100,
      addressId: userAddress.id,
      customerName: 'тест',
      customerPhonenumber: '123123123',
      deliverAt: new Date(),
      archiveAddress: 'тест'
    });

    foodNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    foodType = await FoodType.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id
    });

    food = await Food.create({
      nameLocId: foodNameLoc.id,
      descriptionLocId: foodDescriptionLoc.id,
      price: 1,
      foodTypeId: foodType.id
    });
  });

  beforeEach(async () => {
    await OrderFood.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Order.destroy({ force: true, where: {} });
    await User.scope('all').destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await Facility.destroy({ force: true, where: {} });
    await OrderFood.destroy({ force: true, where: {} });
  });

  it('OrderFood creation test', async () => {
    
    const orderFood = await OrderFood.create({
      orderId: order.id,
      foodId: food.id,
      amount: 1,
      archivePrice: 1,
      archiveFoodName: 'тест'
    });

    expect(orderFood).to.exist;

  });

  it('OrderFood update test', async () => {
    
    const orderFood = await OrderFood.create({
      orderId: order.id,
      foodId: food.id,
      amount: 1,
      archivePrice: 1,
      archiveFoodName: 'тест'
    });

    orderFood.amount = 2;
    orderFood.archivePrice = 2;
    orderFood.archiveFoodName = 'тест2';

    await orderFood.save();

    const orderFoodInDB = await OrderFood.findOne({ where: { id: orderFood.id } });

    expect(orderFoodInDB?.amount).to.equal(2);
    expect(orderFoodInDB?.archivePrice).to.equal(2);
    expect(orderFoodInDB?.archiveFoodName).to.equal('тест2');

  });

  it('OrderFood delete test', async () => {
    
    const orderFood = await OrderFood.create({
      orderId: order.id,
      foodId: food.id,
      amount: 1,
      archivePrice: 1,
      archiveFoodName: 'тест'
    });

    await orderFood.destroy();

    const orderFoodInDB = await OrderFood.findOne({ where: { id: orderFood.id } });

    expect(orderFoodInDB).to.not.exist;

  });

});