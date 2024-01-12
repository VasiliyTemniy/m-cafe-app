import type { IAddressRepo } from '../interfaces';
import type { AddressDTN } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import {
  Address as AddressPG,
  User as UserPG,
  UserAddress as UserAddressPG,
  Facility as FacilityPG } from '@m-cafe-app/db';
import { Address } from '@m-cafe-app/models';
import { AddressMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class AddressRepoSequelizePG implements IAddressRepo {

  /**
   * Use this method only for testing
   */
  async getAll(transaction?: Transaction): Promise<Address[]> {
    if (process.env.NODE_ENV !== 'test') return [];
    const dbAddresses = await AddressPG.scope('all').findAll({ transaction });
    return dbAddresses.map(dbAddress => AddressMapper.dbToDomain(dbAddress));
  }

  /**
   * Use this method only for testing
   */
  async getAllUserAddresses(transaction?: Transaction): Promise<{ userId: number; addressId: number; }[]> {
    if (process.env.NODE_ENV !== 'test') return [];
    const dbUserAddresses = await UserAddressPG.findAll({ transaction });
    return dbUserAddresses.map(({ userId, addressId }) => ({ userId, addressId }));
  }
  
  async getById(id: number, transaction?: Transaction): Promise<Address> {
    const dbAddress = await AddressPG.findByPk(id, { transaction });
    if (!dbAddress) throw new DatabaseError(`No address entry with this id ${id}`);
    return AddressMapper.dbToDomain(dbAddress);
  }

  async getByUserId(userId: number, transaction?: Transaction): Promise<Address[]> {

    const userWithAddresses = await UserPG.scope('allWithAddresses').findByPk(userId, { transaction });
    if (!userWithAddresses) throw new DatabaseError(`No user entry with this id ${userId}`);

    const res: Address[] = userWithAddresses.addresses
      ? userWithAddresses.addresses.map(address => AddressMapper.dbToDomain(address))
      : [];

    return res;
  }

  async findOrCreate(addressDTN: AddressDTN, transaction?: Transaction): Promise<{ address: Address, created: boolean }> {
    // If I do just const address = req.body, some other malformed keys can happen to go through
    const { city, cityDistrict, street, region, regionDistrict, house, entrance, floor, flat, entranceKey } = addressDTN;
    // If I do const address = { city, strees, region, distric, house, entrance, floor, flat, entranceKey }
    // Then where clause for existingAddress fails if one of them is undefined
    const newAddress: AddressDTN = { city, street };
    // Combine two statements above, and you get this bulky construction
    if (cityDistrict) newAddress.cityDistrict = cityDistrict;
    if (region) newAddress.region = region;
    if (regionDistrict) newAddress.regionDistrict = regionDistrict;
    if (house) newAddress.house = house;
    if (entrance) newAddress.entrance = entrance;
    if (floor) newAddress.floor = floor;
    if (flat) newAddress.flat = flat;
    if (entranceKey) newAddress.entranceKey = entranceKey;
    
    // Check for this address, must be unique
    // UNIQUE constraint for postgresql with NULLS NOT DISTINCT did not work - nulls blah blah was ignored by the query
    // Anyway, it did not make it to the DB after migration, and there is no such option in sequelize
    // If I make all fields not nullable and put some defaultValue like '' , validations fail for each and every of these empty strings
    // So, I decided to make this 'unique' check by hand, because I do not want to make user fill every fricking detail
    // and will leave most fields of address as nullables
    const [savedAddress, created] = await AddressPG.findOrCreate({
      where: newAddress,
      transaction
    });
    
    return { address: AddressMapper.dbToDomain(savedAddress), created };
  }

  async update(
    addressToUpdate: Address,
    transaction?: Transaction,
    removeIfUnused: boolean = true
  ): Promise<{ address: Address; updated: boolean; }> {
    // check this.createAddress above for explanation of this bulk
    const {
      id: oldAddressId,
      city,
      cityDistrict,
      street,
      region,
      regionDistrict,
      house,
      entrance,
      floor,
      flat,
      entranceKey
    } = addressToUpdate;
    
    const updAddress: AddressDTN = { city, street };
        
    if (cityDistrict) updAddress.cityDistrict = cityDistrict;
    if (region) updAddress.region = region;
    if (regionDistrict) updAddress.regionDistrict = regionDistrict;
    if (house) updAddress.house = house;
    if (entrance) updAddress.entrance = entrance;
    if (floor) updAddress.floor = floor;
    if (flat) updAddress.flat = flat;
    if (entranceKey) updAddress.entranceKey = entranceKey;
        
    const oldAddress = await AddressPG.findByPk(oldAddressId, { transaction });
    if (!oldAddress) throw new DatabaseError(`No address entry with this id ${oldAddressId}`);
    
    // Check for this address, must be unique
    const [savedAddress, created] = await AddressPG.findOrCreate({
      where: updAddress,
      transaction
    });

    if (removeIfUnused) {
      await this.removeIfUnused(oldAddressId, transaction);
    }

    return { address: AddressMapper.dbToDomain(savedAddress), updated: created };
  }

  async removeIfUnused(addressId: number, transaction?: Transaction): Promise<void> {
    // Check if anything still uses old address
    // One of any is enough for check, findAll is not needed
    const addressUser = await UserAddressPG.findOne({
      where: {
        addressId
      },
      transaction
    });
    const addressFacility = await FacilityPG.findOne({
      where: {
        addressId
      },
      transaction
    });
    
    // If nothing and nobody uses old address, delete it
    if (!addressUser && !addressFacility) await AddressPG.destroy({ where: { id: addressId }, transaction });
  }

  async createUserAddress(
    userId: number,
    addressId: number,
    transaction?: Transaction
  ): Promise<{ created: boolean }> {
    // Check if user already has this address
    const [_savedUserAddress, createdUserAddress] = await UserAddressPG.findOrCreate({
      where: {
        addressId,
        userId
      },
      transaction
    });

    return { created: createdUserAddress };
  }

  async updateUserAddress(
    userId: number,
    addressId: number,
    oldAddressId: number,
    transaction?: Transaction
  ): Promise<{ updated: boolean }> {
    // Check if user already has this new, "updated / edited" address
    const existingUserAddress = await UserAddressPG.findOne({
      where: {
        addressId,
        userId
      },
      transaction
    });

    if (!existingUserAddress) {
      await UserAddressPG.create({ userId, addressId }, { transaction });
      await UserAddressPG.destroy({ where: { userId, addressId: oldAddressId }, transaction });
    }

    return { updated: !existingUserAddress };
  }

  /**
   * Remove user's address by addressId\
   * Checks if address is still used by anything,\
   * If not, deletes it and through-table record.\
   * If yes, deletes only through-table record
   */
  async removeUserAddress(
    userId: number,
    addressId: number,
    transaction?: Transaction
  ): Promise<void> {
    const address = await AddressPG.findByPk(addressId, { transaction });
    if (!address) throw new DatabaseError(`No address entry with this id ${addressId}`);

    await UserAddressPG.destroy({ where: { userId, addressId }, transaction });

    await this.removeIfUnused(addressId, transaction);
  }

  async removeAddressesForOneUser(userId: number, transaction?: Transaction): Promise<void> {
    // Find all user addresses instead of direct deletion
    // Thus, only unused addresses will be deleted
    const userAddresses = await UserAddressPG.findAll({
      where: { userId },
      transaction
    });
    
    for (const userAddress of userAddresses) {
      await this.removeUserAddress(userId, userAddress.addressId, transaction);
      await this.removeIfUnused(userAddress.addressId, transaction);
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await AddressPG.scope('all').destroy({ force: true, where: {} });
    await UserAddressPG.destroy({ force: true, where: {} });
  }
}