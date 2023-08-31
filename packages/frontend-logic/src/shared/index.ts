import { frontendModule } from '../utils/config';

export const { useAppDispatch, useAppSelector } =
  frontendModule === 'admin' ? await import('../../src/admin') :
  frontendModule === 'manager' ? await import('../../src/manager') :
  await import('../../src/customer');