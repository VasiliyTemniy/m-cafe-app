import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import EnvironmentPlugin from 'vite-plugin-environment';

import * as dotenv from "dotenv";

const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    EnvironmentPlugin({
      NODE_ENV: 'production',
      BACKEND_URL: 'must_be_provided',
      DOMAIN_URL: 'must_be_provided',
      FRONTEND_MODULE: 'admin',
      FRONTEND_TARGET_WEB: 'true',
      FIXED_LOC_FILTER: '',
      USERNAME_REGEXP: '',
      USERNAME_MINLEN: '',
      USERNAME_MAXLEN: '',
      NAME_REGEXP: '',
      NAME_MINLEN: '',
      NAME_MAXLEN: '',
      PHONENUMBER_REGEXP: '',
      PHONENUMBER_MINLEN: '',
      PHONENUMBER_MAXLEN: '',
      EMAIL_REGEXP: '',
      EMAIL_MINLEN: '',
      EMAIL_MAXLEN: '',
      DATE_REGEXP: '',
      PASSWORD_REGEXP: '',
      PASSWORD_MINLEN: '',
      PASSWORD_MAXLEN: '',
      REGION_REGEXP: '',
      REGION_MINLEN: '',
      REGION_MAXLEN: '',
      DISTRICT_REGEXP: '',
      DISTRICT_MINLEN: '',
      DISTRICT_MAXLEN: '',
      CITY_REGEXP: '',
      CITY_MINLEN: '',
      CITY_MAXLEN: '',
      STREET_REGEXP: '',
      STREET_MINLEN: '',
      STREET_MAXLEN: '',
      HOUSE_REGEXP: '',
      HOUSE_MINLEN: '',
      HOUSE_MAXLEN: '',
      ENTRANCE_REGEXP: '',
      ENTRANCE_MINLEN: '',
      ENTRANCE_MAXLEN: '',
      FLOOR_MINLEN: '',
      FLOOR_MAXLEN: '',
      FLAT_REGEXP: '',
      FLAT_MINLEN: '',
      FLAT_MAXLEN: '',
      ENTRANCE_KEY_REGEXP: '',
      ENTRANCE_KEY_MINLEN: '',
      ENTRANCE_KEY_MAXLEN: ''
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4002,
    open: './index.html'
  }
});
