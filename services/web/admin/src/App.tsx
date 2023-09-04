import { useAppSelector, useInitAppAdmin } from '@m-cafe-app/frontend-logic/admin/hooks';
import { AppRoutes } from './AppRoutes';
import { LoginPage, Container } from 'shared/components';


export const App = () => {

  useInitAppAdmin();

  const user = useAppSelector((state) => state.user);

  if (!user.phonenumber) {
    return (
      <>
        {/* <Header /> */}
        {/* <Notification/> */}
        <Container className='window-container' id='main-container'>
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
        <Container className='main-container' id='main-container'>
          {/* <Notification/> */}
          <AppRoutes/>
        </Container>
        {/* <Footer /> */}
      </>
    );
  }
};