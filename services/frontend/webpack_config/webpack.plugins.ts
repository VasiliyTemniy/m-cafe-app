import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from "webpack";

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[fullhash].css',
    chunkFilename: '[id].[fullhash].css'
  }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  new webpack.EnvironmentPlugin(['NODE_ENV', 'BACKEND_URL'])
];