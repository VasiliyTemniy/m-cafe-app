import { useLayoutEffect } from 'react';
import { useInitAppShared, useTranslation } from '../../shared/hooks';
import { initFixedLocs, initUiSettings } from '../../shared/reducers';
import { useAppDispatch } from './reduxHooks';


export const useInitAppCustomer = () => {

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    void dispatch(initFixedLocs(t));
    void dispatch(initUiSettings(t));
  }, []);

  useInitAppShared();

};