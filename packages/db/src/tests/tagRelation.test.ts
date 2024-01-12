import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database TagRelation model tests', () => {

  let tag: InstanceType<typeof dbHandler.models.Tag>;

  const pickedParentType = randomEnumValue('TagParentType');

  before(async () => {
    await dbHandler.pingDb();

    tag = await dbHandler.models.Tag.create({
      approvedBy: null,
      name: 'test'
    });
  });

  beforeEach(async () => {
    await dbHandler.models.TagRelation.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.TagRelation.destroy({ force: true, where: {} });
    await dbHandler.models.Tag.destroy({ force: true, where: {} });
  });

  it('TagRelation creation test', async () => {

    const tagRelation = await dbHandler.models.TagRelation.create({
      tagId: tag.id,
      parentId: 1,
      parentType: pickedParentType
    });

    expect(tagRelation).to.exist;

  });

  // All fields are parts of a PK, which should not be updateable; to update, delete and create a new one
  // it('TagRelation update test', async () => {
    
  //   const tagRelation = await dbHandler.models.TagRelation.create({
  //     tagId: tag.id,
  //     parentId: 1,
  //     parentType: pickedParentType
  //   });

  //   tagRelation. = ;

  //   await tagRelation.save();

  //   const tagRelationInDB = await dbHandler.models.TagRelation.findOne({ where: {

  //   } });

  //   expect(tagRelationInDB).to.exist;
  //   expect(tagRelationInDB?.).to.equal();

  // });

  it('TagRelation delete test', async () => {
    
    const tagRelation = await dbHandler.models.TagRelation.create({
      tagId: tag.id,
      parentId: 1,
      parentType: pickedParentType
    });

    await tagRelation.destroy();

    const tagRelationInDB = await dbHandler.models.TagRelation.findOne({ where: {
      tagId: tag.id,
      parentId: 1,
      parentType: pickedParentType
    } });

    expect(tagRelationInDB).to.not.exist;

  });

});