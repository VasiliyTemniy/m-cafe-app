import type { Address, AddressDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';
import type { Transaction } from 'sequelize';

export interface IAddressRepo extends Omit<ICRUDRepo<Address, AddressDTN>, 'create' | 'update' | 'getAll' | 'remove'> {
  getById(id: number): Promise<Address>;
  getByUserId(userId: number): Promise<Address[]>;
  /**
   * Optionally accepts a transaction
   */
  create(addressDTN: AddressDTN, t?: Transaction): Promise<{ address: Address, created: boolean }>;
  /**
   * Optionally accepts a transaction
   */
  update(addressToUpdate: Address, t?: Transaction): Promise<{ address: Address, updated: boolean }>;
  removeIfUnused(addressId: number): Promise<void>;
  createUserAddress(userId: number, addressId: number): Promise<{ created: boolean }>;
  updateUserAddress(userId: number, addressId: number, oldAddressId: number): Promise<{ updated: boolean }>;
  removeUserAddress(userId: number, addressId: number): Promise<void>;
}