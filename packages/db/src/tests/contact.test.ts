import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Contact model tests', () => {

  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedContactType = randomEnumValue('ContactType');
  const pickedContactTarget = randomEnumValue('ContactTarget');
  const pickedContactParentType = randomEnumValue('ContactParentType');

  before(async () => {
    await dbHandler.pingDb();
    
    ({ creator } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Contact.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Contact.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Contact creation test', async () => {

    const contact = await dbHandler.models.Contact.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'test',
      description: 'test',
      type: pickedContactType,
      target: pickedContactTarget,
      parentId: 1, // does not exist
      parentType: pickedContactParentType,
      value: 'test'
    });

    expect(contact).to.exist;

  });

  it('Contact update test', async () => {
    
    const contact = await dbHandler.models.Contact.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'test',
      description: 'test',
      type: pickedContactType,
      target: pickedContactTarget,
      parentId: 1, // does not exist
      parentType: pickedContactParentType,
      value: 'test'
    });

    contact.value = 'test2';

    await contact.save();

    const contactInDB = await dbHandler.models.Contact.findOne({ where: {

    } });

    expect(contactInDB).to.exist;
    expect(contactInDB?.value).to.equal('test2');

  });

  it('Contact delete test', async () => {
    
    const contact = await dbHandler.models.Contact.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'test',
      description: 'test',
      type: pickedContactType,
      target: pickedContactTarget,
      parentId: 1, // does not exist
      parentType: pickedContactParentType,
      value: 'test'
    });

    await contact.destroy();

    const contactInDB = await dbHandler.models.Contact.findOne({ where: {
      id: contact.id
    } });

    expect(contactInDB).to.not.exist;

  });

  it('Contact default scope test: does not include timestamps', async () => {
    
    const contact = await dbHandler.models.Contact.create({
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'test',
      description: 'test',
      type: pickedContactType,
      target: pickedContactTarget,
      parentId: 1, // does not exist
      parentType: pickedContactParentType,
      value: 'test'
    });

    const contactInDB = await dbHandler.models.Contact.findOne({ where: {
      id: contact.id
    } });

    expect(contactInDB?.createdAt).to.not.exist;
    expect(contactInDB?.updatedAt).to.not.exist;

  });

});