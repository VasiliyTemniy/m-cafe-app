import path from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
//import { optimization } from './webpack.optimization';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const config: Configuration = {
    entry: './src/index.tsx',
    output: {
      path: isDevelopment ? path.resolve(__dirname, '.webpack-dev') : path.resolve(__dirname, '.webpack'),
      filename: isDevelopment ? 'build.js' : 'build.[fullhash].js'
    },
    devServer: {
      static: './.webpack-dev',
      compress: true,
      port: 3000,
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