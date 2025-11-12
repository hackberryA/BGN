const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',

    // エントリーポイント
    entry: {
      main: './src/client/main.tsx', // 必要に応じて他の entry を追加可能
    },

    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js', // 衝突防止
      chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js', // dynamic import 用
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
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({ template: './src/client/index.html' }),
      !isProd && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),

    externals: {
      three: 'THREE',                // CDNのTHREEを使用
      'three-csg-ts': 'ThreeCSG',    // CDNのThreeCSGを使用
    },

    devServer: {
      static: path.join(__dirname, 'public'),
      port: 3000,
      hot: true,
      open: false,
      historyApiFallback: true,
    },

    // ソースマップは開発時のみ
    devtool: isProd ? false : 'inline-source-map',

    // ビルド軽量化のための最適化
    optimization: {
      splitChunks: {
        chunks: 'all', // 共通モジュールは別チャンクに分割
      },
      runtimeChunk: 'single', // ランタイムコードを1つにまとめる
    },
  };
};
