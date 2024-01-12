import { expect } from 'chai';
import 'mocha';
import { Organization, User } from '../models';
import { dbHandler } from '../db';
import { PermissionAccess, PermissionAction, PermissionTarget } from '@m-market-app/shared-constants';
import { createOrgAdminManager } from './db_test_helper';



describe('Database Permission model tests', () => {

  let organization: Organization;
  let creator: User;

  before(async () => {
    await dbHandler.pingDb();

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Permission.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Permission.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Permission creation test', async () => {

    // Minimal data
    const permission = await dbHandler.models.Permission.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      target: PermissionTarget.PromoEvent,
      access: PermissionAccess.Organization,
      action: PermissionAction.All
    });

    expect(permission).to.exist;

    // Full data
    const permission2 = await dbHandler.models.Permission.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      target: PermissionTarget.PromoEvent,
      access: PermissionAccess.Organization,
      action: PermissionAction.All,
      isActive: false,
      startsAt: new Date(),
      endsAt: new Date(),
    });

    expect(permission2).to.exist;

  });

  it('Permission update test', async () => {
    
    const permission = await dbHandler.models.Permission.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      target: PermissionTarget.PromoEvent,
      access: PermissionAccess.Organization,
      action: PermissionAction.All
    });

    permission.target = PermissionTarget.UserRole;

    await permission.save();

    const permissionInDB = await dbHandler.models.Permission.findOne({ where: {
      id: permission.id
    } });

    expect(permissionInDB).to.exist;
    expect(permissionInDB?.target).to.equal(PermissionTarget.UserRole);

  });

  it('Permission delete test', async () => {
    
    const permission = await dbHandler.models.Permission.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      target: PermissionTarget.PromoEvent,
      access: PermissionAccess.Organization,
      action: PermissionAction.All
    });

    await permission.destroy();

    const permissionInDB = await dbHandler.models.Permission.findOne({ where: {
      id: permission.id
    } });

    expect(permissionInDB).to.not.exist;

  });

});