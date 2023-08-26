import path from 'path';
import { rules } from './webpack.rules.js';
import { plugins } from './webpack.plugins.js';
//import { optimization } from './webpack.optimization';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import HtmlWebPackPlugin from 'html-webpack-plugin';

import * as dotenv from "dotenv";

const frontend_module = process.env.FRONTEND_MODULE ? process.env.FRONTEND_MODULE : 'customer';
const port =
  frontend_module === 'customer' ?
    process.env.FRONTEND_USER_PORT ? process.env.FRONTEND_USER_PORT : '4002' :
    frontend_module === 'admin' ?
      process.env.FRONTEND_ADMIN_PORT ? process.env.FRONTEND_ADMIN_PORT : '4003' :
      frontend_module === 'manager' ?
        process.env.FRONTEND_MANAGER_PORT ? process.env.FRONTEND_MANAGER_PORT : '4004' :
        '4005';

const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

const isDevelopment = process.env.NODE_ENV === 'development';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const __dirname = path.resolve();

const config: Configuration = {
  context: __dirname,
  entry: `./${frontend_module}/src/index.tsx`,
  output: {
    path: isDevelopment ? path.join(__dirname, `.webpack-dev.${frontend_module}`) : path.join(__dirname, `.webpack.${frontend_module}`),
    filename: isDevelopment ? 'build.js' : 'build.[fullhash].js'
  },
  devServer: {
    static: `./.webpack-dev.${frontend_module}`,
    compress: true,
    port,
    allowedHosts: "all",
    hot: true,
    open: true,
    watchFiles: {
      paths: [`${frontend_module}/src/**/*`, `${frontend_module}/public/**/*`],
      options: {
        usePolling: isDockerized ? false : true
      },
    },
    client: {
      webSocketURL: isDockerized ? 'auto://0.0.0.0:0/ws' : `ws://localhost:${port}/ws`,
    }
  },
  module: {
    rules,
  },
  target: 'web',
  plugins: [
    new HtmlWebPackPlugin({
      template: `./${frontend_module}/public/index.html`,
      filename: './index.html'
    }),
    ...plugins
  ],
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  //optimization, // this thing comes from import, should divide build to smaller pieces for better optimization. Does not work now, though. Performance: hints: false disables warnings now!
  performance: {
    hints: false,
  }
};

export default config;