import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database PromoEventCode model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let promoEvent: InstanceType<typeof dbHandler.models.PromoEvent>;

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
  });

  beforeEach(async () => {
    await dbHandler.models.PromoEventCode.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.PromoEventCode.destroy({ force: true, where: {} });
    await dbHandler.models.PromoEvent.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('PromoEventCode creation test', async () => {

    const promoEventCode = await dbHandler.models.PromoEventCode.create({
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

    expect(promoEventCode).to.exist;

  });

  it('PromoEventCode update test', async () => {
    
    const promoEventCode = await dbHandler.models.PromoEventCode.create({
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

    promoEventCode.discount = 11;

    await promoEventCode.save();

    const promoEventCodeInDB = await dbHandler.models.PromoEventCode.findOne({ where: {
      id: promoEventCode.id
    } });

    expect(promoEventCodeInDB).to.exist;
    expect(promoEventCodeInDB?.discount).to.equal(11);

  });

  it('PromoEventCode delete test', async () => {
    
    const promoEventCode = await dbHandler.models.PromoEventCode.create({
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

    await promoEventCode.destroy();

    const promoEventCodeInDB = await dbHandler.models.PromoEventCode.findOne({ where: {
      id: promoEventCode.id
    } });

    expect(promoEventCodeInDB).to.not.exist;

  });

});