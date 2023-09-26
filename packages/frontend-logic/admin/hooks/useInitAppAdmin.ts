import { useLayoutEffect } from 'react';
import { useInitAppShared, useTranslation } from '../../shared/hooks';
import { initAdminFixedLocs, initAdminUiSettings } from '../reducers';
import { useAppDispatch } from './reduxHooks';
import { domainBaseUrl } from '@m-cafe-app/shared-constants';

export const useInitAppAdmin = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    void dispatch(initAdminFixedLocs(t));
    void dispatch(initAdminUiSettings(t));
  }, []);

  const { user } = useInitAppShared();

  if (user.phonenumber && user.rights === 'manager') window.location.replace(`${domainBaseUrl}/manager/`);
  if (user.phonenumber && user.rights !== 'admin') window.location.replace(`${domainBaseUrl}/`);

};