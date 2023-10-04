import type { UserDT, UserDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';
import type { AdministrateUserBody } from '@m-cafe-app/utils';


export interface IUserService extends ICRUDService<UserDT, UserDTN> {
  getByScope(scope: string): Promise<UserDT[]>
  getSome(limit: number, offset: number): Promise<UserDT[]>
  create(userDTN: UserDTN): Promise<UserDT>
  administrate(id: number, body: AdministrateUserBody): Promise<UserDT>
  delete(id: number): Promise<void>
  initSuperAdmin(): Promise<void>
}