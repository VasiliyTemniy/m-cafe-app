import type { IAddressRepo } from '../interfaces';
import type { AddressDT, AddressDTN } from '@m-cafe-app/models';
import {
  Address as AddressPG,
  User as UserPG,
  UserAddress as UserAddressPG,
  Facility as FacilityPG } from '@m-cafe-app/db';
import { Address } from '@m-cafe-app/models';
import { AddressMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class AddressRepoSequelizePG implements IAddressRepo {
  
  async getById(id: number): Promise<Address> {
    const dbAddress = await AddressPG.findByPk(id);
    if (!dbAddress) throw new DatabaseError(`No address entry with this id ${id}`);
    return AddressMapper.dbToDomain(dbAddress);
  }

  async getByUserId(userId: number): Promise<Address[]> {

    const userWithAddresses = await UserPG.scope('all').findByPk(userId, {
      include: {
        model: AddressPG,
        as: 'addresses',
        required: false,
        through: {
          attributes: []
        }
      }
    });
    if (!userWithAddresses) throw new DatabaseError(`No user entry with this id ${userId}`);

    const res: Address[] = userWithAddresses.addresses
      ? userWithAddresses.addresses.map(address => AddressMapper.dbToDomain(address))
      : [];

    return res;
  }

  async create(addressDTN: AddressDTN): Promise<{ address: Address, created: boolean }> {
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
      where: newAddress
    });
    return { address: AddressMapper.dbToDomain(savedAddress), created };
  }

  async update(addressDT: AddressDT): Promise<{ address: Address; updated: boolean; }> {
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
    } = addressDT;
    
    const updAddress: AddressDT = { id: oldAddressId, city, street };
        
    if (cityDistrict) updAddress.cityDistrict = cityDistrict;
    if (region) updAddress.region = region;
    if (regionDistrict) updAddress.regionDistrict = regionDistrict;
    if (house) updAddress.house = house;
    if (entrance) updAddress.entrance = entrance;
    if (floor) updAddress.floor = floor;
    if (flat) updAddress.flat = flat;
    if (entranceKey) updAddress.entranceKey = entranceKey;
        
    const oldAddress = await AddressPG.findByPk(oldAddressId);
    if (!oldAddress) throw new DatabaseError(`No address entry with this id ${oldAddressId}`);
    
    // Check for this address, must be unique
    const [savedAddress, created] = await AddressPG.findOrCreate({
      where: updAddress
    });

    // Check if anything still uses old address
    // One of any is enough for check, findAll is not needed
    const addressUser = await UserAddressPG.findOne({
      where: {
        addressId: oldAddressId
      }
    });
    const addressFacility = await FacilityPG.findOne({
      where: {
        addressId: oldAddressId
      }
    });
    
    // If nothing and nobody users old address, delete it
    if (!addressUser && !addressFacility) await oldAddress.destroy();

    return { address: AddressMapper.dbToDomain(savedAddress), updated: created };
  }

  async createUserAddress(userId: number, addressId: number): Promise<{ created: boolean }> {
    // Check if user already has this address
    const [_savedUserAddress, createdUserAddress] = await UserAddressPG.findOrCreate({
      where: {
        addressId,
        userId
      }
    });

    return { created: createdUserAddress };
  }

  async updateUserAddress(userId: number, addressId: number, oldAddressId: number): Promise<{ updated: boolean }> {
    // Check if user already has this new, "updated / edited" address
    const existingUserAddress = await UserAddressPG.findOne({
      where: {
        addressId,
        userId
      }
    });

    if (!existingUserAddress) {
      await UserAddressPG.create({ userId, addressId });
      await UserAddressPG.destroy({ where: { userId, addressId: oldAddressId } });
    }

    return { updated: !existingUserAddress };
  }

  /**
   * Remove user's address by addressId\
   * Checks if address is still used by anything,\
   * If not, deletes it and through-table record.\
   * If yes, deletes only through-table record
   */
  async removeUserAddress(userId: number, addressId: number): Promise<void> {
    const address = await AddressPG.findByPk(addressId);
    if (!address) throw new DatabaseError(`No address entry with this id ${addressId}`);

    await UserAddressPG.destroy({ where: { userId, addressId } });

    // Check if anything still uses old address
    // One of any is enough for check, findAll is not needed
    const addressUser = await UserAddressPG.findOne({
      where: {
        addressId
      }
    });
    const addressFacility = await FacilityPG.findOne({
      where: {
        addressId
      }
    });
    
    // If nothing and nobody users old address, delete it
    if (!addressUser && !addressFacility) await address.destroy();
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await AddressPG.scope('all').destroy({ force: true, where: {} });
  }
}