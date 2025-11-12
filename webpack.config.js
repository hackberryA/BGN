const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/client/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: '[name].[contenthash].js', // ← チャンクごとに固有名
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
          exclude: /node_modules/,
        },
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/client/index.html' }),
      !isProd && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    externals: {
      three: 'THREE', // npm の three をバンドルせずに外部の THREE オブジェクトを使う
    },
    devServer: {
      static: path.join(__dirname, 'public'),
      port: 3000,
      hot: true,
      open: false,
      historyApiFallback: true,
    },
    devtool: isProd ? false : 'inline-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};
