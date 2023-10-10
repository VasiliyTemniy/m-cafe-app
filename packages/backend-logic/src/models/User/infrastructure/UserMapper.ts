import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { UserDT, UserDTU } from '@m-cafe-app/models';
import { User } from '@m-cafe-app/models';
import { User as UserPG } from '@m-cafe-app/db';
import { toOptionalDate, toOptionalISOString } from '@m-cafe-app/utils';


export class UserMapper implements EntityDBMapper<User, UserPG>, EntityDTMapper<User, UserDT> {

  /**
   * Caution! Just a mock
   * 
   * @param domainUser 
   * @returns mock
   */
  public static domainToDb(domainUser: User): UserPG {
    const dbUser = new UserPG({ ...domainUser, lookupHash: '' });
    return dbUser;
  }

  domainToDb(domainUser: User): UserPG {
    return UserMapper.domainToDb(domainUser);
  }

  public static dbToDomain(dbUser: UserPG): User {
    const domainUser = new User(
      dbUser.id,
      dbUser.phonenumber,
      dbUser.username,
      dbUser.name,
      dbUser.email,
      dbUser.rights,
      dbUser.birthdate,
      dbUser.lookupHash,
      dbUser.lookupNoise,
      dbUser.createdAt,
      dbUser.updatedAt,
      dbUser.deletedAt
    );
    return domainUser;
  }

  dbToDomain(dbUser: UserPG): User {
    return UserMapper.dbToDomain(dbUser);
  }

  public static dtToDomain(userDT: UserDT | UserDTU): User {
    const domainUser = new User(
      userDT.id,
      userDT.phonenumber,
      userDT.username,
      userDT.name,
      userDT.email,
      undefined, // rights are not held on frontend
      toOptionalDate(userDT.birthdate),
      undefined, // lookupHash is not held on frontend
      undefined, // lookupNoise is not held on frontend
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