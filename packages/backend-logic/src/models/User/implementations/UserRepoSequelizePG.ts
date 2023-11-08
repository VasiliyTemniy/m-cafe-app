import type { User, UserDTN, UserUniqueProperties } from '@m-cafe-app/models';
import type { IUserRepo } from '../interfaces';
import { ApplicationError, DatabaseError, ProhibitedError, toOptionalDate } from '@m-cafe-app/utils';
import { UserMapper } from '../infrastructure';
import { User as UserPG } from '@m-cafe-app/db';
import sha1 from 'sha1';

export class UserRepoSequelizePG implements IUserRepo {

  async getAll(): Promise<User[]> {
    const dbUsers = await UserPG.scope('all').findAll();
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getSome(limit: number, offset: number): Promise<User[]> {
    const dbUsers = await UserPG.scope('all').findAll({
      limit,
      offset
    });
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getByScope(scope: string = 'defaultScope'): Promise<User[]> {
    const dbUsers = await UserPG.scope(scope).findAll();
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getById(id: number): Promise<User> {
    const dbUser = await UserPG.scope('allWithTimestamps').findByPk(id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    return UserMapper.dbToDomain(dbUser);
  }

  async getByUniqueProperties(properties: UserUniqueProperties): Promise<User> {
    const dbUser = await UserPG.scope('allWithTimestamps').findOne({
      where: properties,
      logging: false
    });
    if (!dbUser) throw new DatabaseError(`No user entry with these properties ${properties}`);
    return UserMapper.dbToDomain(dbUser);
  }

  async create(
    userDTN: UserDTN,
    silent: boolean = true,
    overrideRights: string = 'customer',
    lookupNoise: number = 0,
    tries: number = 0):
  Promise<User> {

    if (tries > 5) throw new ApplicationError('Too many tries. This can happen once in an enormous amount of times. Interrupted to avoid data loss. Please, try again manually.');

    const lookupHash = sha1(
      userDTN.phonenumber +
      userDTN.username +
      userDTN.email +
      lookupNoise
    );

    const foundDbUser = await UserPG.scope('all').findOne({ where: { lookupHash } });

    if (foundDbUser) {
      return this.create(userDTN, silent, overrideRights, lookupNoise + Math.round(Math.random() * 100), tries + 1);
    }

    const dbUser = await UserPG.create({ 
      phonenumber: userDTN.phonenumber,
      username: userDTN.username,
      name: userDTN.name,
      email: userDTN.email,
      rights: overrideRights,
      birthdate: toOptionalDate(userDTN.birthdate),
      lookupHash,
      lookupNoise
    }, {
      logging: !silent
    });
    return UserMapper.dbToDomain(dbUser);
  }

  async update(user: User): Promise<User> {
    const dbUser = await UserPG.scope('all').findByPk(user.id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${user.id}`);
    
    if (user.phonenumber) dbUser.phonenumber = user.phonenumber;
    if (user.username) dbUser.username = user.username;
    if (user.name) dbUser.name = user.name;
    if (user.email) dbUser.email = user.email;
    if (user.rights) dbUser.rights = user.rights;
    if (user.birthdate) dbUser.birthdate = user.birthdate;

    await dbUser.save();
    return UserMapper.dbToDomain(dbUser);
  }

  async updateLookupHash(user: User, lookupNoise: number, tries: number = 0): Promise<User> {
    
    if (tries > 5) throw new ProhibitedError('Too many tries. This can happen once in an enormous amount of times. Interrupted to avoid data loss. Please, try again manually.');

    const lookupHash = sha1(
      user.phonenumber +
      user.username +
      user.email +
      lookupNoise
    );

    const foundDbUser = await UserPG.scope('all').findOne({ where: { lookupHash } });

    if (foundDbUser) {
      return this.updateLookupHash(user, lookupNoise + Math.round(Math.random() * 100), tries + 1);
    }

    const userToUpdate = await UserPG.scope('all').findByPk(user.id);
    if (!userToUpdate) throw new DatabaseError(`No user entry with this id ${user.id}`);

    userToUpdate.lookupHash = lookupHash;
    userToUpdate.lookupNoise = lookupNoise;

    await userToUpdate.save();
    
    return UserMapper.dbToDomain(userToUpdate);
  }

  /**
   * Mark user as deleted, add deletedAd timestamp.
   */
  async remove(id: number): Promise<User> {
    const dbUser = await UserPG.scope('all').findByPk(id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    const deletedUser = await dbUser.destroy() as unknown as UserPG; // Correct because of paranoid
    return UserMapper.dbToDomain(deletedUser);
  }

  async restore(id: number): Promise<User> {
    const dbUser = await UserPG.scope('deleted').findByPk(id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    await dbUser.restore();
    return UserMapper.dbToDomain(dbUser);
  }

  /**
   * Remove a user entry from the database entirely.
   */
  async delete(id: number): Promise<void> {
    const dbUser = await UserPG.scope('allWithTimestamps').findByPk(id);

    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    if (!dbUser.deletedAt) throw new ProhibitedError('Only voluntarily deleted users can be fully removed by admins');

    await dbUser.destroy({ force: true });
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await UserPG.scope('all').destroy({ force: true, where: {} });
  }

  async getWithAddresses(id: number): Promise<User> {
    const dbUser = await UserPG.scope('allWithAddresses').findByPk(id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);

    return UserMapper.dbToDomain(dbUser);
  }
}