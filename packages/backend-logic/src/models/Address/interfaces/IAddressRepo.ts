import type { Address, AddressDT, AddressDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IAddressRepo extends Omit<ICRUDRepo<Address, AddressDTN>, 'create' | 'update' | 'getAll' | 'remove'> {
  getById(id: number): Promise<Address>;
  getByUserId(userId: number): Promise<Address[]>;
  create(addressDTN: AddressDTN): Promise<{ address: Address, created: boolean }>;
  update(addressDT: AddressDT): Promise<{ address: Address, updated: boolean }>;
  createUserAddress(userId: number, addressId: number): Promise<{ created: boolean }>;
  updateUserAddress(userId: number, addressId: number, oldAddressId: number): Promise<{ updated: boolean }>;
  removeUserAddress(userId: number, addressId: number): Promise<void>;
}