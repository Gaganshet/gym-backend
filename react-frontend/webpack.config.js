const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs  = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './front/src/less/customize-theme.less'), 'utf8'));

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = { 
    entry: ['babel-polyfill','./front/src/main.js'],
    output: {
      path: path.join(__dirname, '../client'),
      filename: 'index_bundle.js'
    },
    devServer: {
      inline: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      allowedHosts: [
        '24x7fitnessstudio.com'
        ],
        port: 8080,
        proxy: {
          '/': 'http://localhost:3000'
        }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react'],
            plugins: ['transform-class-properties']
          }
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(jpe?g|png|jpg|gif|svg|ico)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }]
        },
        {
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            { 
              loader: "less-loader",
              options: {
                modifyVars: themeVariables,
                javascriptEnabled: true
              }
            }
            ]
        }
        ]
    },
    devtool: '',
    plugins:[
      new HtmlWebpackPlugin({
        template: './front/index.html',
        inject: false
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      })
      ],
      optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin()]
      },
}
