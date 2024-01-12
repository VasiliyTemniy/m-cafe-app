import type { UserDT, UserDTN } from '@m-market-app/models';
import { userService } from '../controllers';

export const validAdminInDB: {
  password: string;
  dtn: Omit<UserDTN, 'id'>;
} = {
  password: 'iwannabeahero123',
  dtn: {
    username: 'Vasil',
    name: 'Petrenko Vasil Karlovich',
    password: 'iwannabeahero123',
    phonenumber: '89351111111',
    email: 'his-email@kontra.com',
    birthdate: '2001-07-23T07:31:03.242Z',
    // rights: 'admin'
  }
};

export const validManagerInDB: {
  password: string;
  dtn: Omit<UserDTN, 'id'>;
} = {
  password: 'iwannabeahero123',
  dtn: {
    username: 'Gennadiy',
    name: 'Kozyulievskii Gennadiy Vasilich',
    password: 'iwannabeahero123',
    phonenumber: '89351010010',
    email: 'hers-email@kontra.com',
    birthdate: '2001-07-23T07:31:03.242Z',
    // rights: 'manager'
  }
};

/**
 * Use only for tests
 */
export const createAdmin = async (userDTN: UserDTN): Promise<UserDT> => {
  const { user, auth: _auth } = await userService.create(userDTN, 'SUPERTEST');

  await userService.administrate(user.id, { rights: 'admin' });

  return user;
};

/**
 * Use only for tests
 */
export const createManager = async (userDTN: UserDTN): Promise<UserDT> => {
  const { user, auth: _auth } = await userService.create(userDTN, 'SUPERTEST');

  await userService.administrate(user.id, { rights: 'manager' });

  return user;
};