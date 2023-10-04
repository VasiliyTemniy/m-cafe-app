import type { UserDT, UserDTN } from '@m-cafe-app/models';
import type { IUserService, IUserRepo } from '../interfaces';
import type { AdministrateUserBody } from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/models';
import { CredentialsError, PasswordLengthError, ProhibitedError, hasOwnProperty } from '@m-cafe-app/utils';
import { UserMapper } from '../infrastructure';
import { maxPasswordLen, minPasswordLen, possibleUserRights } from '@m-cafe-app/shared-constants';
import bcryptjs from 'bcryptjs';
import config from '../../../config.js';
import logger from '../../../utils/logger';


export class UserService implements IUserService {
  constructor( readonly dbRepo: IUserRepo ) {}

  async getAll(): Promise<UserDT[]> {
    const users = await this.dbRepo.getAll();

    const res: UserDT[] =
      users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  async getSome(limit: number, offset: number): Promise<UserDT[]> {
    const users = await this.dbRepo.getSome(limit, offset);

    const res: UserDT[] =
      users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  async getById(id: number): Promise<UserDT> {
    // Apply Auth check!

    const user = await this.dbRepo.getById(id);

    const res: UserDT = UserMapper.domainToDT(user);

    return res;
  }

  async getByScope(scope: string = 'defaultScope'): Promise<UserDT[]> {
    const users = await this.dbRepo.getByScope(scope);

    const res: UserDT[] = users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  // async create(userDTN: UserDTN, password: string): Promise<UserDT> {
  async create(userDTN: UserDTN): Promise<UserDT> {
    if (
      userDTN.password === undefined
      ||
      !(minPasswordLen < userDTN.password.length && userDTN.password.length < maxPasswordLen)
    )
      throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(userDTN.password, saltRounds);

    const savedUser = await this.dbRepo.create(userDTN, passwordHash);

    const res: UserDT = UserMapper.domainToDT(savedUser);
    
    return res;
  }

  async update(userDT: UserDT, password: string, newPassword?: string): Promise<UserDT> {

    const { passwordHash } = await this.dbRepo.getPasswordHashRights(userDT.id);

    const passwordCorrect = await bcryptjs.compare(password, passwordHash);

    if (!passwordCorrect) throw new CredentialsError('Password incorrect');

    let newPasswordHash = passwordHash;

    if (newPassword) {
      if (!(minPasswordLen < newPassword.length && newPassword.length < maxPasswordLen))
        throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

      const saltRounds = 10;
      newPasswordHash = await bcryptjs.hash(newPassword, saltRounds);
    }

    const updatedUser = await this.dbRepo.update(UserMapper.dtToDomain(userDT), newPasswordHash);

    const res: UserDT = UserMapper.domainToDT(updatedUser);
    
    return res;
  }

  async administrate(id: number, body: AdministrateUserBody): Promise<UserDT> {

    let userSubject = await this.dbRepo.getById(id);

    if (userSubject.phonenumber === config.SUPERADMIN_PHONENUMBER)
      throw new ProhibitedError('Attempt to alter superadmin');

    if (hasOwnProperty(body, 'restore') && body.restore) {
      userSubject = await this.restore(id);
    }

    if (hasOwnProperty(body, 'rights')) {
      if (possibleUserRights.includes(body.rights!)) {

        const updUserRights = new User(
          id,
          userSubject.phonenumber,
          undefined,
          undefined,
          undefined,
          body.rights
        );

        userSubject = await this.dbRepo.update(updUserRights);
      }

      if (userSubject.rights === 'disabled') {
        // Implement Session as Auth microservice!
        // await Session.destroy({
        //   where: {
        //     userId: userSubject.id,
        //   }
        // });
      }
    }

    const res: UserDT = UserMapper.domainToDT(userSubject);

    return res;
  }

  /**
   * Mark user as deleted, add deletedAd timestamp.
   */
  async remove(id: number): Promise<UserDT> {
    // Auth module implement!
    // await Session.destroy({ where: { userId: req.user.id } });

    const res: UserDT = UserMapper.domainToDT(await this.dbRepo.remove(id));

    return res;
  }

  private async restore(id: number): Promise<User> {
    const user = await this.dbRepo.restore(id);

    const res: User = user;

    return res;
  }

  /**
   * Remove a user entry from the database entirely.
   */
  async delete(id: number): Promise<void> {
    await this.dbRepo.delete(id);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.removeAll();
  }

  async initSuperAdmin() {

    // Check for existing superadmin
    try {
      const existingUser = await this.dbRepo.getByUniqueProperties({
        phonenumber: config.SUPERADMIN_PHONENUMBER
      });
      if (existingUser) {
  
        // Some paranoid checks
        if (
          existingUser.rights !== 'admin'
        ||
        existingUser.phonenumber !== config.SUPERADMIN_PHONENUMBER
        ) {
          await this.dbRepo.delete(existingUser.id);
          await this.initSuperAdmin();
        }
      }
    } catch (e) {
      // Do nothing;
    }
  
    // New superadmin creation
    const saltRounds = 10;// REMOVE THIS AFTER AUTH MODULE IS FINISHED
    const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);// REMOVE THIS AFTER AUTH MODULE IS FINISHED
  
    const user = {
      username: process.env.SUPERADMIN_USERNAME as string,
      phonenumber: config.SUPERADMIN_PHONENUMBER,
      password: process.env.SUPERADMIN_PASSWORD as string, // REMOVE THIS AFTER AUTH MODULE IS FINISHED
      passwordHash, // REMOVE THIS AFTER AUTH MODULE IS FINISHED
      rights: 'admin'
    };
  
    await this.dbRepo.create(user, passwordHash, true, 'admin');
  
    process.env.SUPERADMIN_USERNAME = '';
    process.env.SUPERADMIN_PASSWORD = '';
  
    return logger.info('Super admin user successfully created!');
  }

}