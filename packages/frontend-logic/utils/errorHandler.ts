import type { TFunction } from '../shared/hooks';
import { isAxiosError } from 'axios';
import { notify } from '../shared/reducers/notificationsReducer';

export const handleAxiosError = (
  e: unknown,
  t: TFunction
) => {
  if (e === null) throw new Error('Unrecoverable error!! Error is null!');
  if (isAxiosError(e)) {

    console.log(e); // remove for prod!

    const message = e.message;
    const response = e.response;
    // const request = e?.request;
    // const config = e?.config;

    if (message === 'Network Error') {
      return notify(t('dummy'), 'error');
    }

    if (!response) throw new Error('Unknown error');

    switch (response.data.message) {

      case 'You are not logged in.':
        return notify(t('dummy'), 'neutral');

      default:
        return notify(t('dummy'), 'error');
    }
  } else {
    return notify(t('dummy'), 'error');
  }
};