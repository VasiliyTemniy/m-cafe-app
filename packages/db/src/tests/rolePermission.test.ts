import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { PermissionAccess, PermissionAction, PermissionTarget } from '@m-market-app/shared-constants';
import { createOrgAdminManager } from './db_test_helper';



describe('Database RolePermission model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;
  let permission: InstanceType<typeof dbHandler.models.Permission>;
  let role: InstanceType<typeof dbHandler.models.Role>;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));

    role = await dbHandler.models.Role.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      name: 'FoodRole',
      description: 'This is a new role'
    });

    permission = await dbHandler.models.Permission.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      target: PermissionTarget.PromoEvent,
      access: PermissionAccess.Organization,
      action: PermissionAction.All
    });
  });

  beforeEach(async () => {
    await dbHandler.models.RolePermission.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.RolePermission.destroy({ force: true, where: {} });
    await dbHandler.models.Permission.destroy({ force: true, where: {} });
    await dbHandler.models.Role.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('RolePermission creation test', async () => {

    const rolePermission = await dbHandler.models.RolePermission.create({
      roleId: role.id,
      permissionId: permission.id,
      createdBy: creator.id
    });

    expect(rolePermission).to.exist;

  });

  it('RolePermission delete test', async () => {
    
    const rolePermission = await dbHandler.models.RolePermission.create({
      roleId: role.id,
      permissionId: permission.id,
      createdBy: creator.id
    });

    await rolePermission.destroy();

    const rolePermissionInDB = await dbHandler.models.RolePermission.findOne({ where: {
      roleId: rolePermission.roleId,
      permissionId: rolePermission.permissionId
    } });

    expect(rolePermissionInDB).to.not.exist;

  });

});