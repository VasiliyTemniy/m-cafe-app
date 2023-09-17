import { useInitAppShared } from "../../shared/hooks";
import { domainBaseUrl } from '@m-cafe-app/shared-constants';

export const useInitAppManager = () => {

  const { user } = useInitAppShared();

  if (user.phonenumber && user.rights !== 'manager') window.location.replace(`${domainBaseUrl}/`);

};