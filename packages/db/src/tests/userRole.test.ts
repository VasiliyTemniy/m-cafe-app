import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, createOrgAdminManager } from './db_test_helper';



describe('Database UserRole model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let role: InstanceType<typeof dbHandler.models.Role>;
  let user: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    role = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'SomeRole',
      description: 'This is a new role'
    });

    ({ customer: user } = await createCustomer(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.UserRole.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.UserRole.destroy({ force: true, where: {} });
    await dbHandler.models.Role.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('UserRole creation test', async () => {

    const userRole = await dbHandler.models.UserRole.create({
      userId: user.id,
      roleId: role.id,
      grantedBy: creator.id
    });

    expect(userRole).to.exist;

    const userRolesInDB = await dbHandler.models.UserRole.findAll({ where: {
      userId: userRole.userId,
      roleId: userRole.roleId
    } });

    expect(userRolesInDB).to.exist;
    expect(userRolesInDB.length).to.equal(1);
    expect(userRolesInDB[0].userId).to.equal(userRole.userId);
    expect(userRolesInDB[0].roleId).to.equal(userRole.roleId);

  });

  it('UserRole delete test', async () => {
    
    const userRole = await dbHandler.models.UserRole.create({
      userId: user.id,
      roleId: role.id,
      grantedBy: creator.id
    });

    await userRole.destroy();

    const userRoleInDB = await dbHandler.models.UserRole.findOne({ where: { userId: userRole.userId } });

    expect(userRoleInDB).to.not.exist;

  });

});