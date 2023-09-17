import path from 'path';
import { rules } from './webpack.rules.js';
import { plugins } from './webpack.plugins.js';
//import { optimization } from './webpack.optimization';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import HtmlWebPackPlugin from 'html-webpack-plugin';

import * as dotenv from "dotenv";

const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

const frontendModule = process.env.FRONTEND_MODULE ? process.env.FRONTEND_MODULE : 'customer';
const port = '4002';
// frontendModule === 'customer' ?
//   process.env.FRONTEND_CUSTOMER_PORT ? process.env.FRONTEND_CUSTOMER_PORT : '4002' :
//   frontendModule === 'admin' ?
//     process.env.FRONTEND_ADMIN_PORT ? process.env.FRONTEND_ADMIN_PORT : '4003' :
//     frontendModule === 'manager' ?
//       process.env.FRONTEND_MANAGER_PORT ? process.env.FRONTEND_MANAGER_PORT : '4004' :
//       '4005';

const outputPublicPath = frontendModule === 'admin' ? '/admin/' :
  frontendModule === 'manager' ? '/manager/' :
  '/';

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) throw new Error('Backend url not set!');

const isDevelopment = process.env.NODE_ENV === 'development';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const __dirname = path.resolve();

const config: Configuration = {
  context: __dirname,
  entry: `./${frontendModule}/src/index.tsx`,
  output: {
    path: isDevelopment ? path.join(__dirname, `.webpack-dev.${frontendModule}`) : path.join(__dirname, `.webpack.${frontendModule}`),
    filename: isDevelopment ? 'build.js' : 'build.[fullhash].js',
    publicPath: outputPublicPath
  },
  devServer: {
    static: `./.webpack-dev.${frontendModule}`,
    compress: true,
    port,
    allowedHosts: "all",
    hot: true,
    open: true,
    historyApiFallback: true,
    watchFiles: {
      paths: [`${frontendModule}/src/**/*`, `${frontendModule}/public/**/*`],
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
      template: `./${frontendModule}/public/index.html`,
      filename: './index.html'
    }),
    ...plugins
  ],
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, 'shared')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  //optimization, // this thing comes from import, should divide build to smaller pieces for better optimization. Does not work now, though. Performance: hints: false disables warnings now!
  performance: {
    hints: false,
  }
};

export default config;