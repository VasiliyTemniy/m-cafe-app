import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database PromoEventCodeUsage model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let promoEvent: InstanceType<typeof dbHandler.models.PromoEvent>;
  let promoEventCode: InstanceType<typeof dbHandler.models.PromoEventCode>;
  let customer: InstanceType<typeof dbHandler.models.User>;

  const pickedCurrencyCode = randomEnumValue('CurrencyCode');

  before(async () => {
    await dbHandler.pingDb();
    
    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    promoEvent = await dbHandler.models.PromoEvent.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      accumulatedPriceCut: 10,
      currencyCode: pickedCurrencyCode,
      isActive: true,
      startsAt: null,
      endsAt: null
    });

    promoEventCode = await dbHandler.models.PromoEventCode.create({
      promoId: promoEvent.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      code: 'code',
      discount: 10,
      priceCutAbsolute: 10,
      isUsageLimited: true,
      usageTotalLimit: 10,
      usagePerUserLimit: 10
    });

    ({ customer } = await createCustomer(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.PromoEventCodeUsage.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.PromoEventCodeUsage.destroy({ force: true, where: {} });
    await dbHandler.models.PromoEvent.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('PromoEventCodeUsage creation test', async () => {

    const promoEventCodeUsage = await dbHandler.models.PromoEventCodeUsage.create({
      promoCodeId: promoEventCode.id,
      userId: customer.id,
      count: 1
    });

    expect(promoEventCodeUsage).to.exist;

  });

  it('PromoEventCodeUsage update test', async () => {
    
    const promoEventCodeUsage = await dbHandler.models.PromoEventCodeUsage.create({
      promoCodeId: promoEventCode.id,
      userId: customer.id,
      count: 1
    });

    promoEventCodeUsage.count = 2;

    await promoEventCodeUsage.save();

    const promoEventCodeUsageInDB = await dbHandler.models.PromoEventCodeUsage.findOne({ where: {
      promoCodeId: promoEventCode.id,
      userId: customer.id
    } });

    expect(promoEventCodeUsageInDB).to.exist;
    expect(promoEventCodeUsageInDB?.count).to.equal(2);

  });

  it('PromoEventCodeUsage delete test', async () => {
    
    const promoEventCodeUsage = await dbHandler.models.PromoEventCodeUsage.create({
      promoCodeId: promoEventCode.id,
      userId: customer.id,
      count: 1
    });

    await promoEventCodeUsage.destroy();

    const promoEventCodeUsageInDB = await dbHandler.models.PromoEventCodeUsage.findOne({ where: {
      promoCodeId: promoEventCode.id,
      userId: customer.id
    } });

    expect(promoEventCodeUsageInDB).to.not.exist;

  });

});