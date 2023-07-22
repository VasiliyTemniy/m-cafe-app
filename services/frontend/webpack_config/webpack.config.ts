import path from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
//import { optimization } from './webpack.optimization';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import * as dotenv from "dotenv";

dotenv.config({
  override: process.env.DOCKERIZED_DEV === 'true' ? false : true
});

const isDevelopment = process.env.NODE_ENV === 'development';
const isDockerized = process.env.DOCKERIZED_DEV === 'true';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  context: path.join(__dirname, '..'),
  entry: './src/index.tsx',
  output: {
    path: isDevelopment ? path.join(__dirname, '..', '.webpack-dev') : path.join(__dirname, '..', '.webpack'),
    filename: isDevelopment ? 'build.js' : 'build.[fullhash].js'
  },
  devServer: {
    static: './.webpack-dev',
    compress: true,
    port: process.env.FRONTEND_PORT,
    allowedHosts: "all",
    hot: true,
    open: true,
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: isDockerized ? false : true
      },
    },
    client: {
      webSocketURL: isDockerized ? 'auto://0.0.0.0:0/ws' : 'ws://localhost:4002/ws',
    }
  },
  module: {
    rules,
  },
  target: 'web',
  plugins,
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