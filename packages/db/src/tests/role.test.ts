import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createOrgAdminManager } from './db_test_helper';



describe('Database Role model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Role.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Role.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Role creation test', async () => {

    // Minimal data
    const role = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodRole',
      description: 'This is a new role'
    });

    expect(role).to.exist;

    // Full data
    const role2 = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'NewFoodRole',
      description: 'This is a new role',
      isActive: false,
      startsAt: new Date(),
      endsAt: new Date(),
    });

    expect(role2).to.exist;

  });

  it('Role update test', async () => {
    
    const role = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodRole',
      description: 'This is a new role'
    });

    role.name = 'UpdatedRole';

    await role.save();

    const roleInDB = await dbHandler.models.Role.findOne({ where: {
      id: role.id
    } });

    expect(roleInDB).to.exist;
    expect(roleInDB?.name).to.equal('UpdatedRole');

  });

  it('Role delete test', async () => {
    
    const role = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodRole',
      description: 'This is a new role'
    });

    await role.destroy();

    const roleInDB = await dbHandler.models.Role.findOne({ where: {
      id: role.id
    } });

    expect(roleInDB).to.not.exist;

  });

});