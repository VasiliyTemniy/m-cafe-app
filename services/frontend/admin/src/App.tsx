import { useAppSelector } from '@m-cafe-app/redux-store/src/admin/hooks/reduxHooks';
import AppRoutes from './AppRoutes';
import LoginPage from 'common/components/LoginPage';
import Container from 'common/components/basic/Container';



const App = () => {

  const user = useAppSelector((state) => state.user);

  // useAppInit();

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
        <Container className='window-container-divider' id='main-container-divider'>
          {/* <Menu /> */}
          <Container className='main-container' id='main-container'>
            {/* <Notification/> */}
            <AppRoutes/>
          </Container>
          {/* <Footer /> */}
        </Container>
      </>
    );
  }
};

export default App;