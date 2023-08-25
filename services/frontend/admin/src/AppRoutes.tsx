import { Outlet, Route, Routes } from 'react-router-dom';

import UnderConstruction from '../../common/components/UnderConstruction';
// import TransactionsPage from './components/TransactionsPage';
// import PortfoliosPage from './components/PortfoliosPage';

const AppRoutes = () => {
  return (
    <>
      <Outlet />
      <Routes>
        {/* <Route path="/" element={<PortfoliosPage />} /> */}
        {/* <Route path="/portfolio" element={<PortfoliosPage />} /> */}
        <Route path="/underconstruction" element={<UnderConstruction/>} />
        {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
      </Routes>
    </>
  );
};

export default AppRoutes;