import { useAppSelector } from '@m-cafe-app/frontend-logic/manager/hooks';
import AppRoutes from './AppRoutes';
// import LoginPage from '../../shared/components/LoginPage';
import { Container } from 'shared/components';


const App = () => {

  const user = useAppSelector((state) => state.user);

  // useAppInit();
  console.log(process.env.FRONTEND_TARGET_WEB);

  if (!user.phonenumber) {
    return (
      <>
        {/* <Header /> */}
        {/* <Notification/> */}
        <Container className='window-container' id='main-container'>
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