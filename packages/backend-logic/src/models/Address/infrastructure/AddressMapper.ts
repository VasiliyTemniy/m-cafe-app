import type { AddressDT } from '@m-cafe-app/models';
import type { Address as AddressPG } from '@m-cafe-app/db';
import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import { Address } from '@m-cafe-app/models';
import { toOptionalISOString } from '@m-cafe-app/utils';

export class AddressMapper implements
  EntityDBMapper<Address, AddressPG>,
  EntityDTMapper<Address, AddressDT> {
  
  public static dbToDomain(dbAddress: AddressPG): Address {
    const domainAddress = new Address(
      dbAddress.id,
      dbAddress.city,
      dbAddress.street,
      dbAddress.house,
      dbAddress.entrance,
      dbAddress.floor,
      dbAddress.flat,
      dbAddress.entranceKey,
      dbAddress.cityDistrict,
      dbAddress.region,
      dbAddress.regionDistrict,
      dbAddress.createdAt,
      dbAddress.updatedAt
    );
    return domainAddress;
  }
  
  dbToDomain(dbAddress: AddressPG): Address {
    return AddressMapper.dbToDomain(dbAddress);
  }
  
  public static dtToDomain(addressDT: AddressDT): Address {
    const domainAddress = new Address(
      addressDT.id,
      addressDT.city,
      addressDT.street,
      addressDT.house,
      addressDT.entrance,
      addressDT.floor,
      addressDT.flat,
      addressDT.entranceKey,
      addressDT.cityDistrict,
      addressDT.region,
      addressDT.regionDistrict,
      // timestamps should not be passed to domain from frontend
      // addressDT.createdAt,
      // addressDT.updatedAt
    );
    return domainAddress;
  }

  dtToDomain(addressDT: AddressDT): Address {
    return AddressMapper.dtToDomain(addressDT);
  }

  public static domainToDT(domainAddress: Address): AddressDT {
    const addressDT: AddressDT = {
      id: domainAddress.id,
      city: domainAddress.city,
      street: domainAddress.street,
      house: domainAddress.house,
      entrance: domainAddress.entrance,
      floor: domainAddress.floor,
      flat: domainAddress.flat,
      entranceKey: domainAddress.entranceKey,
      cityDistrict: domainAddress.cityDistrict,
      region: domainAddress.region,
      regionDistrict: domainAddress.regionDistrict,
      createdAt: toOptionalISOString(domainAddress.createdAt),
      updatedAt: toOptionalISOString(domainAddress.updatedAt)
    };
    return addressDT;
  }

  domainToDT(domainAddress: Address): AddressDT {
    return AddressMapper.domainToDT(domainAddress);
  }
  
}