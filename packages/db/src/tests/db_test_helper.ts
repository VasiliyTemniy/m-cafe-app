import type { IDBHandler } from '../dbHandler';
import * as constants from '@m-cafe-app/shared-constants';
import { UserRights } from '@m-cafe-app/shared-constants';


/**
 * Helps to pick random value from the provided enum
 * @param enumName - the name of the enum
 * @returns a random value from the enum
 */
export const randomEnumValue = (enumName: keyof typeof constants) => {
  const constant = constants[enumName];
  const nonNumericKeys = Object.keys(constant).filter(key => isNaN(Number(key)));
  const randomNonNumericKey = nonNumericKeys[Math.floor(Math.random() * nonNumericKeys.length)];
  return constant[randomNonNumericKey as keyof typeof constant];
};


export const createOrgAdminManager = async (dbHandler: IDBHandler):
Promise<{
  orgAdmin: InstanceType<typeof dbHandler.models.User>,
  creator: InstanceType<typeof dbHandler.models.User>,
  organization: InstanceType<typeof dbHandler.models.Organization>
}> => {
  
  const orgAdmin = await dbHandler.models.User.create({
    username: 'testOrgAdmin',
    phonenumber: '12312312329',
    email: 'test@testOrgAdmin.com',
    birthdate: new Date(),
    rights: UserRights.OrgAdmin,
    lookupHash: 'testlonger2',
    lookupNoise: 3,
  });

  const creator = await dbHandler.models.User.create({
    username: 'testManager',
    phonenumber: '123123298',
    email: 'test@testManager.com',
    birthdate: new Date(),
    rights: UserRights.Manager,
    lookupHash: 'testlonger',
    lookupNoise: 3
  });

  const organization = await dbHandler.models.Organization.create({
    name: 'RogaUndKopita',
    orgAdminId: orgAdmin.id
  });

  return { orgAdmin, creator, organization };
};

export const createCustomer = async (dbHandler: IDBHandler):
Promise<{ customer: InstanceType<typeof dbHandler.models.User> }> => {

  const customer = await dbHandler.models.User.create({
    username: 'testCustomer',
    phonenumber: '123123123500',
    email: 'test@test.com',
    birthdate: new Date(),
    rights: UserRights.Customer,
    lookupHash: 'testEvenlonger',
    lookupNoise: 1
  });

  return { customer };
};


export const createAddress = async (dbHandler: IDBHandler):
Promise<{ address: InstanceType<typeof dbHandler.models.Address> }> => {
  
  const address = await dbHandler.models.Address.create({
    region: 'тест',
    regionDistrict: 'тест',
    city: 'тест',
    cityDistrict: 'тест',
    street: 'тест',
    house: 'тест',
    entrance: 'тест',
    floor: 1,
    flat: 'тест',
    entranceKey: 'тест'
  });

  return { address };
};