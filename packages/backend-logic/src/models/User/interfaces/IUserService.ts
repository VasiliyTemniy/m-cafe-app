import type { AuthResponse, UserDT, UserDTN, UserDTU, UserUniqueProperties } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';
import type { AdministrateUserBody } from '@m-cafe-app/utils';


export interface IUserService extends Omit<ICRUDService<UserDT, UserDTN>, 'create' | 'update'> {
  getByScope(scope: string): Promise<UserDT[]>
  getSome(limit: number, offset: number): Promise<UserDT[]>
  create(userDTN: UserDTN, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}>
  update(userDTU: UserDTU, userAgent: string): Promise<{ user: UserDT, auth: AuthResponse}>
  authenticate(
    password: string,
    credential: UserUniqueProperties,
    userAgent: string
  ): Promise<{ user: UserDT, auth: AuthResponse }>
  logout(id: number, userAgent: string): Promise<void>
  administrate(id: number, body: AdministrateUserBody): Promise<UserDT>
  remove(id: number): Promise<UserDT>
  delete(id: number): Promise<void>
  initSuperAdmin(): Promise<void>
  // resolveAuthLookupHashConflict(user: User, password: string, tries?: number): Promise<{ user: User, auth: AuthResponse }> : private! Thank you, TS!
  cleanSessionRepo(): Promise<void>
}