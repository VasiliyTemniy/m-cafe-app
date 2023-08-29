import { frontendModule } from '../utils/config';

export { sendLogin, sendNewUser } from './reducers/userReducer';
export { useTranslation } from './hooks/useTranslation';

export const { useAppDispatch, useAppSelector } =
  frontendModule === 'admin' ? await import('../../src/admin') :
  frontendModule === 'manager' ? await import('../../src/manager') :
  await import('../../src/customer');