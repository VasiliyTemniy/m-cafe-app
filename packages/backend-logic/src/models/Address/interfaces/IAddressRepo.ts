import type { Address, AddressDTN } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IAddressRepo extends Omit<ICRUDRepo<Address, AddressDTN>, 'create' | 'update' | 'getAll' | 'remove'> {
  getById(id: number): Promise<Address>;
  getByUserId(userId: number): Promise<Address[]>;
  findOrCreate(addressDTN: AddressDTN, transaction?: GenericTransaction): Promise<{ address: Address, created: boolean }>;
  update(addressToUpdate: Address, transaction?: GenericTransaction): Promise<{ address: Address, updated: boolean }>;
  removeIfUnused(addressId: number, transaction?: GenericTransaction): Promise<void>;
  createUserAddress(
    userId: number,
    addressId: number,
    transaction?: GenericTransaction
  ): Promise<{ created: boolean }>;
  updateUserAddress(
    userId: number,
    addressId: number,
    oldAddressId: number,
    transaction?: GenericTransaction
  ): Promise<{ updated: boolean }>;
  /**
   * Remove user's address by addressId\
   * Checks if address is still used by anything,\
   * If not, deletes it and through-table record.\
   * If yes, deletes only through-table record
   */
  removeUserAddress(
    userId: number,
    addressId: number,
    transaction?: GenericTransaction
  ): Promise<void>;
}