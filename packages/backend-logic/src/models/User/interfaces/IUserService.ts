import type {
  AuthResponse,
  UserDT,
  UserDTN,
  UserDTU,
  UserUniqueProperties,
  AdministrateUserBody,
  AddressDTN,
  AddressDT
} from '@m-market-app/models';
import type { ICRUDService } from '../../../utils';


export interface IUserService extends Omit<ICRUDService<UserDT, UserDTN>, 'create' | 'update'> {
  getByScope(scope: string): Promise<UserDT[]>;
  getSome(limit: number, offset: number): Promise<UserDT[]>;
  create(userDTN: UserDTN, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}>;
  update(userDTU: UserDTU, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}>;
  authenticate(
    password: string,
    credential: UserUniqueProperties,
    userAgent: string
  ): Promise<{ user: UserDT, auth: AuthResponse }>;
  refreshToken(token: string, userAgent: string): Promise<AuthResponse>;
  logout(id: number, userAgent: string): Promise<void>;
  administrate(id: number, body: AdministrateUserBody): Promise<UserDT>;
  remove(id: number): Promise<UserDT>;
  removeAll(keepSuperAdmin?: boolean): Promise<void>;
  delete(id: number): Promise<void>;
  initSuperAdmin(): Promise<void>;
  cleanSessionRepo(): Promise<void>;
  createAddress(userId: number, address: AddressDTN): Promise<{ address: AddressDT, created: boolean }>;
  updateAddress(userId: number, address: AddressDT): Promise<{ address: AddressDT, updated: boolean }>;
  removeAddress(userId: number, addressId: number): Promise<void>;
  getWithAddress(id: number): Promise<UserDT>;
}