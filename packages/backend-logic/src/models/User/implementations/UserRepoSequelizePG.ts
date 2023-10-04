import type { User, UserDTN, UserUniqueProperties } from '@m-cafe-app/models';
import type { IUserRepo } from '../interfaces';
import { DatabaseError, ProhibitedError, toOptionalDate } from '@m-cafe-app/utils';
import { UserMapper } from '../infrastructure';
import { User as UserPG } from '@m-cafe-app/db';

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

  async getPasswordHashRights(id: number): Promise<{ id: number; rights: string; passwordHash: string }> {
    const dbUser = await UserPG.scope('passwordHashRights').findByPk(id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    return { id: dbUser.id, rights: dbUser.rights, passwordHash: dbUser.passwordHash};
  }

  async create(userDTN: UserDTN, passwordHash: string, silent: boolean = true, overrideRights: string = 'customer'): Promise<User> {
    const dbUser = await UserPG.create({ 
      phonenumber: userDTN.phonenumber,
      username: userDTN.username,
      name: userDTN.name,
      email: userDTN.email,
      rights: overrideRights,
      birthdate: toOptionalDate(userDTN.birthdate),
      passwordHash
    }, {
      logging: !silent
    });
    return UserMapper.dbToDomain(dbUser);
  }

  async update(user: User, passwordHash?: string): Promise<User> {
    const dbUser = await UserPG.scope('all').findByPk(user.id);
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${user.id}`);
    
    if (user.phonenumber) dbUser.phonenumber = user.phonenumber;
    if (user.username) dbUser.username = user.username;
    if (user.name) dbUser.name = user.name;
    if (user.email) dbUser.email = user.email;
    if (user.rights) dbUser.rights = user.rights;
    if (user.birthdate) dbUser.birthdate = user.birthdate;
    if (passwordHash) dbUser.passwordHash = passwordHash;

    await dbUser.save();
    return UserMapper.dbToDomain(dbUser);
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
}