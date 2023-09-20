import './styles/main.scss';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { createRedux } from "./redux/utils/storePlugin";
import { store } from "./redux/admin/store";

document.getElementsByTagName('html')[0].classList.add('light'); // init default theme - light
document.getElementsByTagName('html')[0].classList.add('trebuchet'); // init default theme - font_trebuchet

createApp(App)
  .use(router)
  .use(createRedux(store))
  .mount("#app");