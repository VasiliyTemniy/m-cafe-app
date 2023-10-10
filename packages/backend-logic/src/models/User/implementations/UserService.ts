import type { AuthResponse, UserDT, UserDTN, UserDTU, UserUniqueProperties } from '@m-cafe-app/models';
import type { IUserService, IUserRepo } from '../interfaces';
import type { ISessionService } from '../../Session';
import type { IAuthControllerInternal } from '../../Auth';
import type { AdministrateUserBody } from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/models';
import { ApplicationError, AuthServiceError, BannedError, CredentialsError, PasswordLengthError, ProhibitedError, UnknownError, hasOwnProperty } from '@m-cafe-app/utils';
import { UserMapper } from '../infrastructure';
import { maxPasswordLen, minPasswordLen, possibleUserRights } from '@m-cafe-app/shared-constants';
import config from '../../../config.js';
import logger from '../../../utils/logger';


export class UserService implements IUserService {
  constructor(
    readonly repo: IUserRepo,
    readonly sessionService: ISessionService,
    readonly authController: IAuthControllerInternal
  ) {}

  async getAll(): Promise<UserDT[]> {
    const users = await this.repo.getAll();

    const res: UserDT[] =
      users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  async getSome(limit: number, offset: number): Promise<UserDT[]> {
    const users = await this.repo.getSome(limit, offset);

    const res: UserDT[] =
      users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  async getById(id: number): Promise<UserDT> {
    const user = await this.repo.getById(id);

    const res: UserDT = UserMapper.domainToDT(user);

    return res;
  }

  async getByScope(scope: string = 'defaultScope'): Promise<UserDT[]> {
    const users = await this.repo.getByScope(scope);

    const res: UserDT[] = users.map(user => UserMapper.domainToDT(user));

    return res;
  }

  async create(userDTN: UserDTN, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}> {
    if (
      userDTN.password === undefined
      ||
      !(minPasswordLen < userDTN.password.length && userDTN.password.length < maxPasswordLen)
    )
      throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

    const savedUser = await this.repo.create(userDTN);

    const { user: authorizedUser, auth: userAuth } = await this.resolveAuthLookupHashConflict(savedUser, userDTN.password);

    if (!authorizedUser.rights)
      throw new ApplicationError('Failed to create user');

    await this.sessionService.create(authorizedUser.id, userAuth.token, userAgent, authorizedUser.rights);

    const res: { user: UserDT, auth: AuthResponse } = {
      user: UserMapper.domainToDT(authorizedUser),
      auth: userAuth
    };
    
    return res;
  }

  async update(userDTU: UserDTU, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}> {

    const foundUser = await this.repo.getById(userDTU.id);

    if (foundUser.phonenumber === config.SUPERADMIN_PHONENUMBER)
      throw new ProhibitedError('Attempt to alter superadmin');
    if (foundUser.rights === 'disabled')
      throw new ProhibitedError('Attempt to alter disabled user');
    if (!foundUser.lookupHash || !foundUser.rights)
      throw new ApplicationError('User data corrupt: lookupHash or rights are missing');

    const checkCredentials = await this.authController.verifyCredentials({
      lookupHash: foundUser.lookupHash,
      password: userDTU.password
    });

    if (!checkCredentials.success || checkCredentials.error !== '') {
      console.log(checkCredentials);
      // ACHTUNG CHECK actual error texts coming from AuthController
      if (checkCredentials.error === 'User not found')
        // HERE! Change error to createAuthRequest instead after actual error codes investigation
        throw new ApplicationError('User not found on auth server. Please, contact the admins to resolve this problem');
        // HERE! Change error to createAuthRequest instead after actual error codes investigation
      else if (checkCredentials.error === 'Wrong password')
        throw new CredentialsError('Password incorrect');
      else 
        throw new UnknownError(checkCredentials.error);
        // ACHTUNG CHECK actual error texts coming from AuthController
    }

    if (userDTU.newPassword)
      if (!(minPasswordLen < userDTU.newPassword.length && userDTU.newPassword.length < maxPasswordLen))
        throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

    const updatedUser = await this.repo.update(UserMapper.dtToDomain(userDTU));

    if (!updatedUser.lookupHash || !updatedUser.rights)
      throw new ApplicationError('User data corrupt: lookupHash or rights are missing');

    // Does not need to resolve any lookupHash conflicts because they should not exist -
    // user must be already authorized to even get to this point
    const userAuth = await this.authController.update({
      id: updatedUser.id,
      lookupHash: updatedUser.lookupHash,
      oldPassword: userDTU.password,
      newPassword: userDTU.newPassword ? userDTU.newPassword : userDTU.password
    });

    await this.sessionService.update(updatedUser.id, userAuth.token, userAgent, updatedUser.rights);

    const res: { user: UserDT, auth: AuthResponse } = {
      user: UserMapper.domainToDT(updatedUser),
      auth: userAuth
    };
    
    return res;
  }

  async authenticate(password: string, credential: UserUniqueProperties): Promise<{ user: UserDT; auth: AuthResponse; }> {

    if (credential.phonenumber === config.SUPERADMIN_PHONENUMBER) throw new ProhibitedError('Superadmin must login only with a username');

    const whereClause = {} as UserUniqueProperties;
    if (credential.username) whereClause.username = credential.username;
    if (credential.phonenumber) whereClause.phonenumber = credential.phonenumber;
    if (credential.email) whereClause.email = credential.email;

    const user = await this.repo.getByUniqueProperties(whereClause);

    if (!user.lookupHash)
      throw new ApplicationError('User data corrupt: lookupHash is missing. Please, contact the admins to resolve this problem');
    if (user.rights === 'disabled')
      throw new BannedError('Your account have been banned. Contact admin to unblock account');
    if (user.deletedAt)
      throw new ProhibitedError('You have deleted your own account. To delete it permanently or restore it, contact admin');

    const auth = await this.authController.grant({ id: user.id, lookupHash: user.lookupHash, password });

    if (!auth.token || auth.error || auth.id !== user.id)
      throw new AuthServiceError(auth.error);

    const res: { user: UserDT; auth: AuthResponse; } = {
      user: UserMapper.domainToDT(user),
      auth
    };

    return res;
  }

  async logout(id: number, userAgent: string): Promise<void> {
    await this.sessionService.remove({ where: { userId: id, userAgent } });
  }

  async administrate(id: number, body: AdministrateUserBody): Promise<UserDT> {

    let userSubject = await this.repo.getById(id);

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

        userSubject = await this.repo.update(updUserRights);
      }

      if (userSubject.rights === 'disabled') {
        await this.sessionService.remove({ where: { userId: userSubject.id } });
      }
    }

    const res: UserDT = UserMapper.domainToDT(userSubject);

    return res;
  }

  /**
   * Mark user as deleted, add deletedAd timestamp.
   */
  async remove(id: number): Promise<UserDT> {
    await this.sessionService.remove({ where: { userId: id } });

    const deletedUser = await this.repo.remove(id);

    if (!deletedUser.lookupHash)
      throw new ApplicationError('User data corrupt: lookupHash is missing');

    await this.authController.remove({ lookupHash: deletedUser.lookupHash });

    const res: UserDT = UserMapper.domainToDT(deletedUser);

    return res;
  }

  private async restore(id: number): Promise<User> {
    const user = await this.repo.restore(id);

    const res: User = user;

    return res;
  }

  /**
   * Remove a user entry from the database entirely.
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.repo.removeAll();
  }

  async initSuperAdmin() {

    // Check for existing superadmin
    try {
      const existingUser = await this.repo.getByUniqueProperties({
        phonenumber: config.SUPERADMIN_PHONENUMBER
      });
      if (existingUser) {
  
        // Some paranoid checks
        if (
          existingUser.rights !== 'admin'
          ||
          existingUser.phonenumber !== config.SUPERADMIN_PHONENUMBER
        ) {
          await this.repo.delete(existingUser.id);
          await this.initSuperAdmin();
        }
      }
    } catch (e) {
      logger.shout('Could not update superadmin rights', e);
      process.exit(1);
    }

    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
    if (!superAdminPassword) 
      throw new ApplicationError('Super admin password is not defined');

    const superAdminUsername = process.env.SUPERADMIN_USERNAME;
    if (!superAdminUsername) 
      throw new ApplicationError('Super admin username is not defined');

    // New superadmin creation
    const user = {
      username: superAdminUsername,
      phonenumber: config.SUPERADMIN_PHONENUMBER,
      password: superAdminPassword,
      rights: 'admin'
    };
  
    const savedSuperAdmin = await this.repo.create(user, true, 'admin');

    if (!savedSuperAdmin.lookupHash || !savedSuperAdmin.rights)
      throw new ApplicationError('Failed to create superadmin');

    await this.authController.create({
      id: savedSuperAdmin.id,
      lookupHash: savedSuperAdmin.lookupHash,
      password: superAdminPassword
    });
  
    process.env.SUPERADMIN_USERNAME = '';
    process.env.SUPERADMIN_PASSWORD = '';
  
    return logger.info('Super admin user successfully created!');
  }

  private async resolveAuthLookupHashConflict(user: User, password: string, tries: number = 0): Promise<{ user: User; auth: AuthResponse; }> {

    if (tries > 5) throw new ApplicationError('Too many tries. This can happen once in an enormous amount of times. Interrupted to avoid data loss. Please, try again manually.');

    if (!user.lookupHash)
      throw new ApplicationError('User data corrupt: lookupHash is missing');
    
    const auth = await this.authController.create({ id: user.id, lookupHash: user.lookupHash, password });

    if (!auth.token || auth.error || auth.id !== user.id) {
      logger.shout('Failed to create auth token', auth);  // ACHTUNG! REMOVE THIS WHEN ACTUAL ERROR TEXT IS KNOWN
      if (auth.error === 'User already exists') {
        const userWithNewLookupHash = await this.repo.updateLookupHash(user, user.lookupNoise);
        return this.resolveAuthLookupHashConflict(userWithNewLookupHash, password);
      } else {
        throw new UnknownError(auth.error);
      }
    }

    return { user, auth };
  }
}