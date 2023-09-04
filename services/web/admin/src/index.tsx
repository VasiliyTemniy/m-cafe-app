import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@m-cafe-app/frontend-logic/admin';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { App } from './App';

// import './i18n';

// import './scss_common/main.scss';

document.getElementsByTagName('html')[0].classList.add('light'); // init default theme - light
document.getElementsByTagName('html')[0].classList.add('trebuchet'); // init default theme - font_trebuchet

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}> {/* change this to rolling circle! */}
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </Router>
        </Provider>
      </Suspense>
    </React.StrictMode>,
  );  

}