import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createCustomer, createOrgAdminManager } from './db_test_helper';



describe('Database OrganizationManager model tests', () => {

  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let user: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ organization } = await createOrgAdminManager(dbHandler));

    ({ customer: user } = await createCustomer(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.OrganizationManager.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.OrganizationManager.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('OrganizationManager creation test', async () => {

    const organizationManager = await dbHandler.models.OrganizationManager.create({
      userId: user.id,
      organizationId: organization.id
    });

    expect(organizationManager).to.exist;

  });

  it('OrganizationManager delete test', async () => {

    const organizationManager = await dbHandler.models.OrganizationManager.create({
      userId: user.id,
      organizationId: organization.id
    });

    await organizationManager.destroy();

    const organizationManagerInDB = await dbHandler.models.OrganizationManager.findOne({ where: { userId: user.id } });

    expect(organizationManagerInDB).to.not.exist;

  });

});