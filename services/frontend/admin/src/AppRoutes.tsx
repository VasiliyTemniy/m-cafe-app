import { Outlet, Route, Routes } from 'react-router-dom';

import UnderConstruction from '../../shared/components/UnderConstruction';

import { apiBaseUrl } from '../../shared/utils/config';

const AppRoutes = () => {
  return (
    <>
      <Outlet />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/under-construction" element={<UnderConstruction svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
      </Routes>
    </>
  );
};

export default AppRoutes;