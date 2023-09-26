import { useLayoutEffect } from 'react';
import { useInitAppShared, useTranslation } from '../../shared/hooks';
import { initFixedLocs, initUiSettings } from '../../shared/reducers';
import { useAppDispatch } from './reduxHooks';
import { domainBaseUrl } from '@m-cafe-app/shared-constants';

export const useInitAppManager = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    void dispatch(initFixedLocs(t));
    void dispatch(initUiSettings(t));
  }, []);

  const { user } = useInitAppShared();

  if (user.phonenumber && (user.rights !== 'manager' && user.rights !== 'admin')) window.location.replace(`${domainBaseUrl}/`);

};