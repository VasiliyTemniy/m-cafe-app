import type { AppDispatch } from '../store';
import { createSlice } from '@reduxjs/toolkit';
// import { notificationArrayLength, notificationShowTime } from '../constants';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'neutral';
}

type SetNotificationAction = {
  payload: {
    notification: Notification,
    timeoutId: number
  };
};

type NotificationState = {
  log: Notification[],
  timeoutId: number
};

const initialState: NotificationState = { log: [{ message: '', type: 'success'}], timeoutId: 0 };

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state: NotificationState, action: SetNotificationAction) {
      const notificationArray = state.log.length > 100 // notificationArrayLength
        ? [ ...state.log ].filter((item, index) => index !== 0)
        : [ ...state.log ];

      clearTimeout(state.timeoutId);
      notificationArray.push(action.payload.notification);
      return { log: notificationArray, timeoutId: action.payload.timeoutId };
    },
    hideNotifications(state: NotificationState) {
      return { ...state, timeoutId: 0 };
    },
    clearNotifications() {
      return { ...initialState };
    }
  },
});

export const { addNotification, hideNotifications, clearNotifications } = notificationSlice.actions;

export const showNotification = (message: string, type: 'success' | 'error' | 'neutral') => {
  return (dispatch: AppDispatch) => {
    const now = new Date();

    const hours = now.getHours() > 9
      ? `${now.getHours()}`
      : `0${now.getHours()}`;
    const mins = now.getMinutes() > 9
      ? `${now.getMinutes()}`
      : `0${now.getMinutes()}`;
    const seconds = now.getSeconds() > 9
      ? `${now.getSeconds()}`
      : `0${now.getSeconds()}`;

    const timeNow = `${now.getDate()}.${now.getMonth()}  ${hours}:${mins}:${seconds}`;

    const timeoutId: number = window.setTimeout(() => {
      dispatch(hideNotifications());
    }, 3000); // notificationShowTime);
    
    dispatch(addNotification({ notification: { message: `[${timeNow}]: ${message}`, type }, timeoutId }));
  };
};

export default notificationSlice.reducer;