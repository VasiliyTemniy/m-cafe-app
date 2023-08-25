import { isAxiosError } from "axios";
import { showNotification } from "../user/reducers/notificationsReducer";

export const handleAxiosError = (
  e: unknown,
) => {
  if (e === null) throw new Error('Unrecoverable error!! Error is null!');
  if (isAxiosError(e)) {

    console.log(e); // remove for prod!

    const message = e.message;
    const response = e.response;
    // const request = e?.request;
    // const config = e?.config;

    if (message === 'Network Error') {
      return showNotification('dummy', 'error');
    }

    if (!response) throw new Error('Unknown error');

    switch (response.data.message) {

      case 'You are not logged in.':
        return showNotification('dummy', 'neutral');

      default:
        return showNotification('dummy', 'error');
    }
  } else {
    return showNotification('dummy', 'error');
  }
};