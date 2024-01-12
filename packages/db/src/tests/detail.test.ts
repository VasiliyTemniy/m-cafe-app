import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Detail model tests', () => {

  let creator: InstanceType<typeof dbHandler.models.User>;
  let detailGroup: InstanceType<typeof dbHandler.models.DetailGroup>;
  let semantics: InstanceType<typeof dbHandler.models.Semantics>;
  let semanticValue: InstanceType<typeof dbHandler.models.SemanticValue>;

  const pickedParentType = randomEnumValue('DetailGroupParentType');

  before(async () => {
    await dbHandler.pingDb();

    ({ creator } = await createOrgAdminManager(dbHandler));

    detailGroup = await dbHandler.models.DetailGroup.create({
      parentId: 0,
      parentType: pickedParentType,
      createdBy: creator.id,
      updatedBy: creator.id
    });

    semantics = await dbHandler.models.Semantics.create({
      approvedBy: creator.id,
      technicalName: 'EngineRotationSpeed'
    });

    semanticValue = await dbHandler.models.SemanticValue.create({
      semanticId: semantics.id,
      approvedBy: creator.id,
      technicalValue: 'RPM'
    });
  });

  beforeEach(async () => {
    await dbHandler.models.Detail.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.SemanticValue.destroy({ force: true, where: {} });
    await dbHandler.models.Semantics.destroy({ force: true, where: {} });
    await dbHandler.models.Detail.destroy({ force: true, where: {} });
    await dbHandler.models.DetailGroup.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Detail creation test', async () => {

    // Minimal data - without semantics
    const detail = await dbHandler.models.Detail.create({
      detailGroupId: detailGroup.id,
      createdBy: creator.id,
      updatedBy: creator.id
    });

    expect(detail).to.exist;

    // Full data
    const detail2 = await dbHandler.models.Detail.create({
      detailGroupId: detailGroup.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      semanticValueId: semanticValue.id,
      semanticValueNumeric: 1000
    });

    expect(detail2).to.exist;

  });

  it('Detail update test', async () => {
    
    const detail = await dbHandler.models.Detail.create({
      detailGroupId: detailGroup.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      semanticValueId: semanticValue.id,
      semanticValueNumeric: 1000
    });

    detail.semanticValueNumeric = 2000;

    await detail.save();

    const detailInDB = await dbHandler.models.Detail.findOne({ where: {
      id: detail.id
    } });

    expect(detailInDB).to.exist;
    expect(detailInDB?.semanticValueNumeric).to.equal(2000);

  });

  it('Detail delete test', async () => {
    
    const detail = await dbHandler.models.Detail.create({
      detailGroupId: detailGroup.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      semanticValueId: semanticValue.id,
      semanticValueNumeric: 1000
    });

    await detail.destroy();

    const detailInDB = await dbHandler.models.Detail.findOne({ where: {
      id: detail.id
    } });

    expect(detailInDB).to.not.exist;

  });

});