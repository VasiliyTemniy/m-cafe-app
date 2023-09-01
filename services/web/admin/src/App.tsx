import { useAppSelector } from '@m-cafe-app/frontend-logic/src/admin/hooks/reduxHooks';
import AppRoutes from './AppRoutes';
// import LoginPage from '../../shared/components/LoginPage';
import { ContainerLC } from '../../shared/components/basic/ContainerLC';



const App = () => {

  const user = useAppSelector((state) => state.user);

  // useAppInit();

  if (!user.phonenumber) {
    return (
      <>
        {/* <Header /> */}
        {/* <Notification/> */}
        <ContainerLC className='window-container' id='main-container'>
          {/* <LoginPage/> */}
          <AppRoutes/>
        </ContainerLC>
        {/* <Footer /> */}
      </>
    );
  } else {
    return (
      <>
        {/* <Header /> */}
        {/* <Menu /> */}
        <ContainerLC className='main-container' id='main-container'>
          {/* <Notification/> */}
          <AppRoutes/>
        </ContainerLC>
        {/* <Footer /> */}
      </>
    );
  }
};

export default App;