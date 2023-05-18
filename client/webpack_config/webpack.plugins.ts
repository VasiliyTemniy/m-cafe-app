import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CleanWebpackPlugin(),
  new HtmlWebPackPlugin({
    template: './public/index.html',
    filename: './index.html'
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[fullhash].css',
    chunkFilename: '[id].[fullhash].css'
  })
];