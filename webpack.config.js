// webpack.config.js - ПРОСТОЕ исправление ошибок
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './index.web.js',

  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
    alias: {
      'react-native': 'react-native-web',

      // ПРОСТОЙ фикс проблемных иконок
      'react-native-vector-icons/MaterialCommunityIcons': 'react-native-web/dist/exports/Text',
      'react-native-vector-icons/MaterialIcons': 'react-native-web/dist/exports/Text',
      'react-native-vector-icons/Ionicons': 'react-native-web/dist/exports/Text',
      '@react-native-vector-icons/material-design-icons': 'react-native-web/dist/exports/Text',
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      vm: require.resolve('vm-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
      assert: require.resolve('assert'),
      url: require.resolve('url'),
      querystring: require.resolve('querystring-es3'),

      fs: false,
      net: false,
      tls: false,
      child_process: false,
      dns: false,
      dgram: false,
      cluster: false,
      module: false,
      readline: false,
      repl: false,
      zlib: false,
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },

      // Игнорируем проблемные файлы
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'CryptoNow'
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true,
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

    // Игнорируем проблемные модули
    new webpack.IgnorePlugin({
      resourceRegExp: /@expo\/vector-icons/,
    }),
  ],

  devServer: {
    port: 19006,
    host: 'localhost',
    hot: true,
    open: true,
  },

  performance: {
    hints: false
  }
};