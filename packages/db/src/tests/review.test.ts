import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, randomEnumValue } from './db_test_helper';
import { ratingLowestLimit, ratingHighestLimit } from '@m-market-app/shared-constants';



describe('Database Review model tests', () => {

  let user: InstanceType<typeof dbHandler.models.User>;

  const pickedParentType = randomEnumValue('ReviewParentType');

  const pickedRating = Math.floor(Math.random() * (ratingHighestLimit - ratingLowestLimit + 1)) + ratingLowestLimit;

  before(async () => {
    await dbHandler.pingDb();

    ({ customer: user } = await createCustomer(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Review.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Review.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Review creation test', async () => {

    const review = await dbHandler.models.Review.create({
      parentType: pickedParentType,
      parentId: 1, // does not exist
      userId: user.id,
      text: 'text',
      rating: pickedRating,
      blockedReason: 'reason'
    });

    expect(review).to.exist;

  });

  it('Review update test', async () => {
    
    const review = await dbHandler.models.Review.create({
      parentType: pickedParentType,
      parentId: 1, // does not exist
      userId: user.id,
      text: 'text',
      rating: pickedRating,
      blockedReason: 'reason'
    });

    review.blockedReason = 'good reason';

    await review.save();

    const reviewInDB = await dbHandler.models.Review.findOne({ where: {
      id: review.id
    } });

    expect(reviewInDB).to.exist;
    expect(reviewInDB?.blockedReason).to.equal('good reason');

  });

  it('Review delete test', async () => {
    
    const review = await dbHandler.models.Review.create({
      parentType: pickedParentType,
      parentId: 1, // does not exist
      userId: user.id,
      text: 'text',
      rating: pickedRating,
      blockedReason: 'reason'
    });

    await review.destroy();

    const reviewInDB = await dbHandler.models.Review.findOne({ where: {

    } });

    expect(reviewInDB).to.not.exist;

  });

  it('Review default scope test: does not include timestamps', async () => {
    
    await dbHandler.models.Review.create({
      parentType: pickedParentType,
      parentId: 1, // does not exist
      userId: user.id,
      text: 'text',
      rating: pickedRating,
      blockedReason: 'reason'
    });

    const reviewInDB = await dbHandler.models.Review.findOne({ where: {

    } });

    expect(reviewInDB?.createdAt).to.not.exist;
    expect(reviewInDB?.updatedAt).to.not.exist;

  });

});