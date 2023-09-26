import { useAppSelector, useInitAppAdmin } from '@m-cafe-app/frontend-logic/admin/hooks';
import { Loading } from 'shared/components';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';


export const App = () => {

  useInitAppAdmin();

  const uiSettingsHash = useAppSelector(state => state.settings.parsedUiSettingsHash);
  const fixedLocsHash = useAppSelector(state => state.fixedLocs.parsedFixedLocsHash);

  if (!uiSettingsHash || !fixedLocsHash)
    return <Loading size='medium'/>;

  return (
    <RouterProvider router={router} />
  );
};