const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './index.web.js',

  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',

      // Заменяем проблемные иконки на простой Text
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

      // Отключаем Node.js модули
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
        // Обрабатываем все файлы кроме большинства node_modules, но включаем React Native библиотеки
        exclude: /node_modules\/(?!(react-native|@react-native|react-native-.*|@expo|expo-.*)\/)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },

      // CSS файлы
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // Шрифты и изображения
      {
        test: /\.(ttf|woff|woff2|eot)$/,
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
      'process.env.EXPO_PUBLIC_USE_STATIC': JSON.stringify('true'),
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

    // Игнорируем проблемные модули
    new webpack.IgnorePlugin({
      resourceRegExp: /@expo\/vector-icons/,
    }),

    // Игнорируем React Native специфичные модули
    new webpack.IgnorePlugin({
      resourceRegExp: /^react-native$/,
      contextRegExp: /react-native-gesture-handler/,
    }),
  ],

  devServer: {
    port: 19006,
    host: 'localhost',
    hot: true,
    open: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  performance: {
    hints: false
  },

  stats: {
    warnings: false
  }
};