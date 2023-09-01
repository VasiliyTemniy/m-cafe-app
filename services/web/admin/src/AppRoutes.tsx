import { Outlet, Route, Routes } from 'react-router-dom';

import { UnderConstructionLC } from '../../shared/components';

import { apiBaseUrl } from '@m-cafe-app/shared-constants';

const AppRoutes = () => {
  return (
    <>
      <Outlet />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/under-construction" element={<UnderConstructionLC svgUrl={`${apiBaseUrl}/public/pictures/svg/construction.svg`}/>} />
      </Routes>
    </>
  );
};

export default AppRoutes;