import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from "webpack";

const frontendModule = process.env.FRONTEND_MODULE ? process.env.FRONTEND_MODULE : 'customer';
const isDevelopment = process.env.NODE_ENV === 'development';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CleanWebpackPlugin(),
  !isDevelopment && new MiniCssExtractPlugin({
    filename: '[name].[fullhash].css',
    chunkFilename: '[id].[fullhash].css'
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'production',
    BACKEND_URL: 'must_be_provided',
    FRONTEND_MODULE: frontendModule,
    FRONTEND_MODULE_ADMIN: frontendModule === 'admin',
    FRONTEND_MODULE_MANAGER: frontendModule === 'manager',
    FRONTEND_MODULE_CUSTOMER: frontendModule === 'customer',
    FRONTEND_TARGET_WEB: true,
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
];