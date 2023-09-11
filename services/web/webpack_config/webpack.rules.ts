import type { ModuleOptions } from 'webpack';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isDevelopment = process.env.NODE_ENV === 'development';

export const rules: Required<ModuleOptions>['rules'] = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack\.admin|\.webpack\.customer|\.webpack\.manager|\.webpack)/,
    use: {
      loader: 'babel-loader',
      // loader: 'ts-loader',
      // options: {
      //   transpileOnly: true,
      // },
    },
  },
  {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: { minimize: !isDevelopment }
      }
    ]
  },
  {
    test: /\.s[ac]ss$/i,
    use: [isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; ! 2 ! => postcss-loader, sass-loader
        },
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              [
                "postcss-preset-env",
                { /* Options*/ },
              ],
              [
                "postcss-combine-duplicated-selectors",
                { removeDuplicatedValues: true }
              ]
            ],
          },
        },
      },
      "sass-loader",
    ],
  },
  {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ['@svgr/webpack'],
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  }
];
