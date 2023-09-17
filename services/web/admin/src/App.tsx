import { useAppSelector, useInitAppAdmin } from '@m-cafe-app/frontend-logic/admin/hooks';
import { AppRoutes } from './AppRoutes';
import { LoginPage, Loading, AppContent, Wrapper, Header } from 'shared/components';
import { collapseExpanded } from '@m-cafe-app/frontend-logic/utils';
import { StaffSidebar } from 'shared/staffComponents';


export const App = () => {

  useInitAppAdmin();

  const uiSettingsHash = useAppSelector(state => state.settings.uiSettingsHash);
  const fixedLocsHash = useAppSelector(state => state.fixedLocs.locsHash);
  const user = useAppSelector(state => state.user);

  if (!uiSettingsHash || !fixedLocsHash)
    return <Loading size='medium'/>;

  if (!user.phonenumber) {
    return (
      <>
        {/* <Notification/> */}
        <Wrapper id='app-wrapper' onClick={() => collapseExpanded()}>
          <Header />
          <AppContent>
            <LoginPage
              modalActive={true}
              onCancel={() => null}
            />
          </AppContent>
        </Wrapper>
      </>
    );
  } else {
    return (
      <>
        <Wrapper id='app-wrapper' onClick={() => collapseExpanded()}>
          <Header />
          <AppContent>
            {/* <Notification/> */}
            <AppRoutes/>
          </AppContent>
          <StaffSidebar/>
        </Wrapper>
      </>
    );
  }
};