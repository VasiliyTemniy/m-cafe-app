import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { UserDT } from '@m-cafe-app/models';
import { User } from '@m-cafe-app/models';
import { User as UserPG } from '@m-cafe-app/db';
import { toOptionalDate, toOptionalISOString } from '@m-cafe-app/utils';


export class UserMapper implements EntityDBMapper<User, UserPG>, EntityDTMapper<User, UserDT> {

  /**
   * Caution! Just a mock, passwordHash is not stored in domain instances,
   * but is necessary for DB. Use service.getById to get passwordHash
   * 
   * @param domainUser 
   * @returns mock
   */
  public static domainToDb(domainUser: User): UserPG {
    const dbUser = new UserPG({ ...domainUser, passwordHash: '' });
    return dbUser;
  }

  domainToDb(domainUser: User): UserPG {
    return UserMapper.domainToDb(domainUser);
  }

  public static dbToDomain(dbUser: UserPG): User {
    // No password or passwordHash
    const domainUser = new User(
      dbUser.id,
      dbUser.phonenumber,
      dbUser.username,
      dbUser.name,
      dbUser.email,
      dbUser.rights,
      dbUser.birthdate,
      dbUser.createdAt,
      dbUser.updatedAt,
      dbUser.deletedAt
    );
    return domainUser;
  }

  dbToDomain(dbUser: UserPG): User {
    return UserMapper.dbToDomain(dbUser);
  }

  public static dtToDomain(userDT: UserDT): User {
    const domainUser = new User(
      userDT.id,
      userDT.phonenumber,
      userDT.username,
      userDT.name,
      userDT.email,
      userDT.rights,
      toOptionalDate(userDT.birthdate),
      toOptionalDate(userDT.createdAt),
      toOptionalDate(userDT.updatedAt),
      toOptionalDate(userDT.deletedAt)
    );
    return domainUser;
  }
  
  dtToDomain(userDT: UserDT): User {
    return UserMapper.dtToDomain(userDT);
  }

  public static domainToDT(domainUser: User): UserDT {
    // No password, passwordHash for http
    const userDT: UserDT = {
      id: domainUser.id,
      phonenumber: domainUser.phonenumber,
      username: domainUser.username,
      name: domainUser.name,
      email: domainUser.email,
      rights: domainUser.rights,
      birthdate: toOptionalISOString(domainUser.birthdate),
      createdAt: toOptionalISOString(domainUser.createdAt),
      updatedAt: toOptionalISOString(domainUser.updatedAt),
      deletedAt: toOptionalISOString(domainUser.deletedAt)
    };
    return userDT;
  }

  domainToDT(domainUser: User): UserDT {
    return UserMapper.domainToDT(domainUser);
  }

}