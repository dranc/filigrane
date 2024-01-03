'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.ts',
    contentScript: PATHS.src + '/contentScript.ts',
    background: PATHS.src + '/background.ts',
    index: PATHS.src + '/index.ts',
    style: PATHS.src + '/asset/style/index.scss'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
            {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          {
              loader: 'file-loader',
              options: { outputPath: 'style/', name: '[name].min.css'}
          },
          'sass-loader'
        ]
    }
    ],
  },
});

module.exports = config;
