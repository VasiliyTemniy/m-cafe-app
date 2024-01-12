import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { CurrencyCode, OfferCodeGenerationMethod, OfferGrantMethod, OfferType } from '@m-market-app/shared-constants';
import { createOrgAdminManager } from './db_test_helper';



describe('Database OfferPolicy model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.OfferPolicy.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OfferPolicy.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OfferPolicy creation test', async () => {

    // Minimal data
    const offerPolicy = await dbHandler.models.OfferPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewOfferPolicy',
      description: 'This is a new offer policy',
      totalIncomeThreshold: 100,
      categorizedIncomeThreshold: 100,
      offerType: OfferType.Discount,
      offerGrantMethod: OfferGrantMethod.Auto,
      offerCodeGenerationMethod: OfferCodeGenerationMethod.UUID,
      setOfferName: 'test',
      setOfferDescription: 'test',
    });

    expect(offerPolicy).to.exist;

    // Full data
    const offerPolicy2 = await dbHandler.models.OfferPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewOfferPolicy',
      description: 'This is a new offer policy',
      totalIncomeThreshold: 100,
      categorizedIncomeThreshold: 100,
      offerType: OfferType.Combined,
      offerGrantMethod: OfferGrantMethod.Manual,
      offerCodeGenerationMethod: OfferCodeGenerationMethod.Manual,
      setOfferName: 'test',
      setOfferDescription: 'test',
      setDiscount: 10,
      setMsUnusedToDeactivateDiscount: 100,
      addBonusQuantity: 10,
      setBonusMultiplier: 10,
      setBonusToCurrencyRate: 10,
      setBonusExpiracyMs: 100,
      setDeliveryFreeThreshold: 100,
      setOfferCurrencyCode: CurrencyCode.USD,
      setOfferAvailableAtDelayMs: 100,
      setBonusAvailableAtDelayMs: 100,
      isActive: false,
      startsAt: new Date(),
      endsAt: new Date()
    });

    expect(offerPolicy2).to.exist;

  });

  it('OfferPolicy update test', async () => {
    
    const offerPolicy = await dbHandler.models.OfferPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewOfferPolicy',
      description: 'This is a new offer policy',
      totalIncomeThreshold: 100,
      categorizedIncomeThreshold: 100,
      offerType: OfferType.Discount,
      offerGrantMethod: OfferGrantMethod.Auto,
      offerCodeGenerationMethod: OfferCodeGenerationMethod.UUID,
      setOfferName: 'test',
      setOfferDescription: 'test',
      isActive: true
    });

    offerPolicy.setOfferCurrencyCode = CurrencyCode.USD;

    await offerPolicy.save();

    const offerPolicyInDB = await dbHandler.models.OfferPolicy.findOne({ where: {
      id: offerPolicy.id
    } });

    expect(offerPolicyInDB).to.exist;
    expect(offerPolicyInDB?.setOfferCurrencyCode).to.equal(CurrencyCode.USD);

  });

  it('OfferPolicy delete test', async () => {
    
    const offerPolicy = await dbHandler.models.OfferPolicy.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewOfferPolicy',
      description: 'This is a new offer policy',
      totalIncomeThreshold: 100,
      categorizedIncomeThreshold: 100,
      offerType: OfferType.Discount,
      offerGrantMethod: OfferGrantMethod.Auto,
      offerCodeGenerationMethod: OfferCodeGenerationMethod.UUID,
      setOfferName: 'test',
      setOfferDescription: 'test',
      isActive: true
    });

    await offerPolicy.destroy();

    const offerPolicyInDB = await dbHandler.models.OfferPolicy.findOne({ where: {
      id: offerPolicy.id
    } });

    expect(offerPolicyInDB).to.not.exist;

  });

});