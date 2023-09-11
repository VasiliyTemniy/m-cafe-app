import { useAppSelector, useInitAppAdmin } from '@m-cafe-app/frontend-logic/admin/hooks';
import { AppRoutes } from './AppRoutes';
import { LoginPage, Loading, Scrollable, Container } from 'shared/components';


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
        {/* <Header /> */}
        {/* <Notification/> */}
        <Container id='app-wrapper'>
          <Scrollable wrapperClassNameAddon='app-content-wrapper' id='app-content'>
            {/* <ColorTestPage/> */}
            <LoginPage/>
          </Scrollable>
        </Container>
        {/* <Footer /> */}
      </>
    );
  } else {
    return (
      <>
        {/* <Header /> */}
        {/* <Menu /> */}
        <Container id='app-wrapper'>
          <Scrollable wrapperClassNameAddon='app-content-wrapper' id='app-content'>
            {/* <Notification/> */}
            <AppRoutes/>
          </Scrollable>
        </Container>
        {/* <Footer /> */}
      </>
    );
  }
};