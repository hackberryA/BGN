const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/client/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: 'ts-loader',
                options: { transpileOnly: true }, // react-refreshと併用
            },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
        // { test: /\.yml$/, loader: "js-yaml-loader" },
        // {
        //   test: /\.(png|jpe?g|gif|svg|webp)$/i,
        //   type: 'asset/resource', // webpack 5 以降はこれでOK
        // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(), // ← HMRプラグイン
  ],
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000,
    hot: true,                // ← ホットリロードON
    open: true,               // ← ブラウザ自動起動
    historyApiFallback: true, // ← React Router対応
  },
  devtool: 'inline-source-map', // ソースマップ有効
};
