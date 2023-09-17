import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@m-cafe-app/frontend-logic/customer';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { App } from './App';

import 'shared/styles/main.scss';
import { Loading } from 'shared/components';

document.getElementsByTagName('html')[0].classList.add('light'); // init default theme - light
document.getElementsByTagName('html')[0].classList.add('trebuchet'); // init default theme - font_trebuchet

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Suspense fallback={<Loading size='medium'/>}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </Provider>
    </Suspense>,
  );

}