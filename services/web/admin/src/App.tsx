import { useAppSelector, useInitAppAdmin } from '@m-cafe-app/frontend-logic/admin/hooks';
import { AppRoutes } from './AppRoutes';
import { LoginPage, Container, Loading } from 'shared/components';
// import { Container, Loading, ColorTestPage } from 'shared/components';


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
        <Container classNameAddon='window-container' id='main-container'>
          {/* <ColorTestPage/> */}
          <LoginPage/>
        </Container>
        {/* <Footer /> */}
      </>
    );
  } else {
    return (
      <>
        {/* <Header /> */}
        {/* <Menu /> */}
        <Container classNameAddon='main-container' id='main-container'>
          {/* <Notification/> */}
          <AppRoutes/>
        </Container>
        {/* <Footer /> */}
      </>
    );
  }
};