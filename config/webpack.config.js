'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    shared: PATHS.src + '/shared.ts',
    popup: PATHS.src + '/popup.ts',
    popupbackup: PATHS.src + '/popup-backup.js',
    contentScript: PATHS.src + '/contentScript.ts',
    background: PATHS.src + '/background.js',
  },
  module: {
    rules: [
       {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
       },
    ],
 },
});

module.exports = config;
