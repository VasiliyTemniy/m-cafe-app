import type { CommonProps } from '@m-market-app/frontend-logic/types';
import { useAppSelector, useInitLC } from '@m-market-app/frontend-logic/shared/hooks';

const notificationTimeout = Number(process.env.NOTIFICATION_TIMEOUT) || 4000;

export interface NotificationProps extends CommonProps {
}

export const Notification = ({
  classNameOverride,
  classNameAddon,
  id = 'notification'
}: NotificationProps ) => {

  const timeoutId = useAppSelector(state => state.notifications.timeoutId);
  const notificationArray = useAppSelector(state => state.notifications.log);

  const { className, style: uiSettingsStyle, specific } = useInitLC({
    componentType: 'notification',
    componentName: 'notification',
    classNameAddon: classNameAddon,
    classNameOverride: classNameOverride
  });

  const lastNotification = notificationArray.at(-1);

  if (!lastNotification || timeoutId === 0 || specific?.hidden) return null;

  return (
    <div
      id={id}
      className={className}
      style={{
        ...uiSettingsStyle,
        animation: specific?.animate ? `toggle-visibility-notificaion ${notificationTimeout}s forwards ease-in-out` : undefined
      }}
    >
      {lastNotification.message.length > 0 && lastNotification.message}
    </div>
  );
};