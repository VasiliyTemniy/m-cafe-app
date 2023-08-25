import { useAppSelector } from '@m-cafe-app/redux-store/src/admin/hooks/reduxHooks';
import AppRoutes from './AppRoutes';
// import LoginPage from 'common/components/LoginPage';
import Container from '../../common/components/basic/Container';



const App = () => {

  const user = useAppSelector((state) => state.user);

  // useAppInit();

  if (!user.phonenumber) {
    return (
      <>
        {/* <Header /> */}
        {/* <Notification/> */}
        <Container className='window-container' id='main-container'>
          {/* <LoginPage/> */}
          <AppRoutes/>
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

export default App;