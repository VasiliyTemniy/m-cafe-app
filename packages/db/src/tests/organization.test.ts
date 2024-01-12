import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { UserRights } from '@m-market-app/shared-constants';



describe('Database Organization model tests', () => {

  let orgAdmin: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    orgAdmin = await dbHandler.models.User.create({
      username: 'testOrgAdmin',
      phonenumber: '12312312329',
      email: 'test@testOrgAdmin.com',
      birthdate: new Date(),
      rights: UserRights.OrgAdmin,
      lookupHash: 'testlonger2',
      lookupNoise: 3
    });
  });

  beforeEach(async () => {
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Organization creation test', async () => {

    // Minimal data
    const organization = await dbHandler.models.Organization.create({
      name: 'RogaUndKopita',
      orgAdminId: orgAdmin.id
    });

    expect(organization).to.exist;

    // Full data
    const organization2 = await dbHandler.models.Organization.create({
      name: 'тест',
      orgAdminId: orgAdmin.id,
      maxPolicies: 10000,
      maxManagers: 10000,
      maxProducts: 10000,
      maxPictures: 10000,
      maxDetails: 10000,
      maxDynamicModules: 10000,
      maxEvents: 10000,
      maxRoles: 10000,
      maxPermissions: 10000,
      maxTags: 10000,
      usedPolicies: 10000,
      usedManagers: 10000,
      usedProducts: 10000,
      usedPictures: 10000,
      usedDetails: 10000,
      usedDynamicModules: 10000,
      usedEvents: 10000,
      usedRoles: 10000,
      usedPermissions: 10000,
      usedTags: 10000
    });

    expect(organization2).to.exist;

  });

  it('Organization update test', async () => {
    
    const organization = await dbHandler.models.Organization.create({
      name: 'RogaUndKopita',
      orgAdminId: orgAdmin.id
    });

    organization.name = 'тест2';
    organization.usedTags = 2;

    await organization.save();

    const organizationInDB = await dbHandler.models.Organization.findOne({ where: {
      id: organization.id
    } });

    expect(organizationInDB).to.exist;
    expect(organizationInDB?.name).to.equal('тест2');
    expect(organizationInDB?.usedTags).to.equal(2);

  });

  it('Organization delete test', async () => {
    
    const organization = await dbHandler.models.Organization.create({
      name: 'RogaUndKopita',
      orgAdminId: orgAdmin.id
    });

    await organization.destroy();

    const organizationInDB = await dbHandler.models.Organization.findOne({ where: {

    } });

    expect(organizationInDB).to.not.exist;

  });

  it('Organization default scope test: does not include timestamps', async () => {
    
    const organization = await dbHandler.models.Organization.create({
      name: 'RogaUndKopita',
      orgAdminId: orgAdmin.id
    });

    const organizationInDB = await dbHandler.models.Organization.findOne({ where: {
      id: organization.id
    } });

    expect(organizationInDB?.createdAt).to.not.exist;
    expect(organizationInDB?.updatedAt).to.not.exist;

  });

});