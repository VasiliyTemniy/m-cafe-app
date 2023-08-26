import { useAppSelector } from '@m-cafe-app/frontend-logic/src/admin/hooks/reduxHooks';
import AppRoutes from './AppRoutes';
// import LoginPage from '../../shared/components/LoginPage';
import Container from '../../shared/components/basic/Container';



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