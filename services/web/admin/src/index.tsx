import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@m-market-app/frontend-logic/admin';
import { App } from './App';

import 'shared/styles/main.scss';
import { Loading } from 'shared/components';

document.getElementsByTagName('html')[0].classList.add('light'); // init default theme - light
document.getElementsByTagName('html')[0].classList.add('trebuchet'); // init default theme - font_trebuchet

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Suspense fallback={<Loading size='medium'/>}>
        <Provider store={store}>
          <App/>
        </Provider>
      </Suspense>
    </React.StrictMode>,
  );  
}