// babel.config.js - Упрощенная версия
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions']
      }
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    '@babel/preset-typescript'
  ],

  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
};