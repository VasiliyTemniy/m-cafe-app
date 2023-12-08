import type { User, UserDTN, UserUniqueProperties } from '@m-cafe-app/models';
import type { IUserRepo } from '../interfaces';
import type { Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { ApplicationError, DatabaseError, ProhibitedError, toOptionalDate } from '@m-cafe-app/utils';
import { UserMapper } from '../infrastructure';
import { User as UserPG } from '@m-cafe-app/db';
import sha1 from 'sha1';
import config from '../../../config';

export class UserRepoSequelizePG implements IUserRepo {

  async getAll(transaction?: Transaction): Promise<User[]> {
    const dbUsers = await UserPG.scope('all').findAll({ transaction });
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getSome(limit: number, offset: number, scope: string = 'all', transaction?: Transaction): Promise<User[]> {
    const dbUsers = await UserPG.scope(scope).findAll({
      limit,
      offset,
      transaction
    });
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getByScope(scope: string = 'defaultScope', transaction?: Transaction): Promise<User[]> {
    const dbUsers = await UserPG.scope(scope).findAll({ transaction });
    return dbUsers.map(user => UserMapper.dbToDomain(user));
  }

  async getById(id: number, transaction?: Transaction): Promise<User> {
    const dbUser = await UserPG.scope('allWithTimestamps').findByPk(id, { transaction });
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    return UserMapper.dbToDomain(dbUser);
  }

  async getByUniqueProperties(properties: UserUniqueProperties, transaction?: Transaction): Promise<User> {
    const dbUser = await UserPG.scope('allWithTimestamps').findOne({
      where: properties,
      logging: false,
      transaction
    });
    if (!dbUser) throw new DatabaseError(`No user entry with these properties ${properties}`);
    return UserMapper.dbToDomain(dbUser);
  }

  async create(
    userDTN: UserDTN,
    silent: boolean = true,
    overrideRights: string = 'customer',
    lookupNoise: number = 0,
    tries: number = 0,
    transaction?: Transaction):
  Promise<User> {

    if (tries > 5) throw new ApplicationError('Too many tries. This can happen once in an enormous amount of times. Interrupted to avoid data loss. Please, try again manually.');

    const lookupHash = sha1(
      userDTN.phonenumber +
      userDTN.username +
      userDTN.email +
      lookupNoise
    );

    const foundDbUser = await UserPG.scope('all').findOne({ where: { lookupHash }, transaction });

    if (foundDbUser) {
      return this.create(
        userDTN,
        silent,
        overrideRights,
        lookupNoise + Math.round(Math.random() * 100),
        tries + 1,
        transaction
      );
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
      logging: !silent,
      transaction
    });
    return UserMapper.dbToDomain(dbUser);
  }

  async update(user: User, transaction?: Transaction): Promise<User> {
    const dataToUpdate: {
      phonenumber?: string;
      username?: string;
      name?: string;
      email?: string;
      rights?: string;
      birthdate?: Date;
    } = {};

    if (user.phonenumber) dataToUpdate.phonenumber = user.phonenumber;
    if (user.username) dataToUpdate.username = user.username;
    if (user.name) dataToUpdate.name = user.name;
    if (user.email) dataToUpdate.email = user.email;
    if (user.rights) dataToUpdate.rights = user.rights;
    if (user.birthdate) dataToUpdate.birthdate = user.birthdate;

    const [ count, updated ] = await UserPG.scope('all').update(dataToUpdate, {
      where: { id: user.id },
      returning: true,
      transaction
    });

    if (count === 0) throw new DatabaseError(`No user entry with this id ${user.id}`);

    return UserMapper.dbToDomain(updated[0]);
  }

  async updateLookupHash(user: User, lookupNoise: number, tries: number = 0, transaction?: Transaction): Promise<User> {
    
    if (tries > 5) throw new ProhibitedError('Too many tries. This can happen once in an enormous amount of times. Interrupted to avoid data loss. Please, try again manually.');

    const lookupHash = sha1(
      user.phonenumber +
      user.username +
      user.email +
      lookupNoise
    );

    const foundDbUser = await UserPG.scope('all').findOne({ where: { lookupHash }, transaction });

    if (foundDbUser) {
      return this.updateLookupHash(
        user,
        lookupNoise + Math.round(Math.random() * 100),
        tries + 1,
        transaction
      );
    }

    const userToUpdate = await UserPG.scope('all').findByPk(user.id, { transaction });
    if (!userToUpdate) throw new DatabaseError(`No user entry with this id ${user.id}`);

    userToUpdate.lookupHash = lookupHash;
    userToUpdate.lookupNoise = lookupNoise;

    await userToUpdate.save();
    
    return UserMapper.dbToDomain(userToUpdate);
  }

  /**
   * Mark user as deleted, add deletedAt timestamp.
   */
  async remove(id: number, transaction?: Transaction): Promise<User> {
    const count = await UserPG.scope('all').destroy({
      where: { id },
      transaction
    });
    const deletedUser = await UserPG.scope('deleted').findByPk(id, { transaction });
    if (count === 0 || !deletedUser) throw new DatabaseError(`No user entry with this id ${id}`);
    return UserMapper.dbToDomain(deletedUser);
  }

  async restore(id: number, transaction?: Transaction): Promise<User> {
    const dbUser = await UserPG.scope('deleted').findByPk(id, { transaction });
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    await dbUser.restore();
    return UserMapper.dbToDomain(dbUser);
  }

  /**
   * Remove a user entry from the database entirely.
   */
  async delete(id: number, transaction?: Transaction): Promise<void> {
    const dbUser = await UserPG.scope('allWithTimestamps').findByPk(id, { transaction });

    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);
    if (!dbUser.deletedAt) throw new ProhibitedError('Only voluntarily deleted users can be fully removed by admins');

    await dbUser.destroy({ force: true, transaction });
  }

  /**
   * Method works only for node_env===test
   * Difference - check for voluntary deletion is omitted
   */
  async deleteForTest(id: number, transaction?: Transaction): Promise<void> {
    if (process.env.NODE_ENV !== 'test') throw new ApplicationError('Method works only for test');
    await UserPG.scope('all').destroy({ force: true, where: { id }, transaction });
  }

  async removeAll(keepSuperAdmin: boolean = false): Promise<void> {
    if (keepSuperAdmin) {
      await UserPG.scope('all').destroy({ force: true, where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      } });
    }
    else {
      await UserPG.scope('all').destroy({ force: true, where: {} });
    }
  }

  async getWithAddresses(id: number, transaction?: Transaction): Promise<User> {
    const dbUser = await UserPG.scope('allWithAddresses').findByPk(id, { transaction });
    if (!dbUser) throw new DatabaseError(`No user entry with this id ${id}`);

    return UserMapper.dbToDomain(dbUser);
  }

  async changeRightsBulk(ids: number[], rights: string, transaction: Transaction): Promise<User[]> {

    const [ count, updated ] = await UserPG.scope('all').update({
      rights
    }, {
      where: ids.map(id => ({ id })),
      transaction,
      returning: true
    });

    if (count !== ids.length) throw new DatabaseError('Not all users could be changed');

    return updated.map(user => UserMapper.dbToDomain(user));
  }
}