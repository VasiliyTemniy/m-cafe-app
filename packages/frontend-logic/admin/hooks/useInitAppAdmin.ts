import { useInitAppShared } from '../../shared/hooks';
import { domainBaseUrl } from '@m-cafe-app/shared-constants';

export const useInitAppAdmin = () => {

  const { user } = useInitAppShared();

  if (user.phonenumber && user.rights === 'manager') window.location.replace(`${domainBaseUrl}/manager/`);
  if (user.phonenumber && user.rights !== 'admin') window.location.replace(`${domainBaseUrl}/`);

};