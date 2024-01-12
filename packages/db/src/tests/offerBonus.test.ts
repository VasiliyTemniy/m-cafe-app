import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database OfferBonus model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let customer: InstanceType<typeof dbHandler.models.User>;
  let offer: InstanceType<typeof dbHandler.models.Offer>;

  const pickedOfferType = randomEnumValue('OfferType');
  const pickedOfferGrantMethod = randomEnumValue('OfferGrantMethod');
  const pickedCurrencyCode = randomEnumValue('CurrencyCode');
  
  before(async () => {
    await dbHandler.pingDb();

    ({ organization } = await createOrgAdminManager(dbHandler));

    ({ customer } = await createCustomer(dbHandler));

    offer = await dbHandler.models.Offer.create({
      organizationId: organization.id,
      userId: customer.id,
      type: pickedOfferType,
      grantMethod: pickedOfferGrantMethod,
      name: 'NewOffer',
      description: 'Description',
      code: 'CODE',
      discount: 10,
      bonusToCurrencyRate: 1,
      bonusGainMultiplier: 1,
      deliveryFreeThreshold: 100,
      currencyCode: pickedCurrencyCode,
      lastUsedAt: new Date(),
      availableAt: new Date(),
    });
  });

  beforeEach(async () => {
    await dbHandler.models.OfferBonus.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OfferBonus.destroy({ force: true, where: {} });
    await dbHandler.models.Offer.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OfferBonus creation test', async () => {

    // declare offerId: ForeignKey<Offer['id']>;
    // declare quantity: number;
    // declare usedQuantity: number;
    // declare availableAt: Date;
    // declare expiresAt: Date | null;

    const offerBonus = await dbHandler.models.OfferBonus.create({
      offerId: offer.id,
      quantity: 10,
      usedQuantity: 0,
      availableAt: new Date(),
      expiresAt: null
    });

    expect(offerBonus).to.exist;

  });

  it('OfferBonus update test', async () => {
    
    const offerBonus = await dbHandler.models.OfferBonus.create({
      offerId: offer.id,
      quantity: 10,
      usedQuantity: 0,
      availableAt: new Date(),
      expiresAt: null
    });

    offerBonus.usedQuantity = 5;

    await offerBonus.save();

    const offerBonusInDB = await dbHandler.models.OfferBonus.findOne({ where: {
      id: offerBonus.id
    } });

    expect(offerBonusInDB).to.exist;
    expect(offerBonusInDB?.usedQuantity).to.equal(5);

  });

  it('OfferBonus delete test', async () => {
    
    const offerBonus = await dbHandler.models.OfferBonus.create({
      offerId: offer.id,
      quantity: 10,
      usedQuantity: 0,
      availableAt: new Date(),
      expiresAt: null
    });

    await offerBonus.destroy();

    const offerBonusInDB = await dbHandler.models.OfferBonus.findOne({ where: {
      id: offerBonus.id
    } });

    expect(offerBonusInDB).to.not.exist;

  });

});