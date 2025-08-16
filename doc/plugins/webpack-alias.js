const path = require('path');

module.exports = function webpackAliasPlugin() {
  return {
    name: 'webpack-alias-plugin',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@site': path.resolve(__dirname, '..'),
            '@src': path.resolve(__dirname, '../src'),
          },
        },
      };
    },
  };
};
