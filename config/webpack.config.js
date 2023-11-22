'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.ts',
    contentScript: PATHS.src + '/contentScript.ts',
    background: PATHS.src + '/background.js',
    index: PATHS.src + '/index.ts'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
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
