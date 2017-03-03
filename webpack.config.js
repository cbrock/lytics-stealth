var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var LiveReloadPlugin = require('webpack-livereload-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?indentedSyntax=false&includePaths[]=' + path.resolve(__dirname, './dist')
]

module.exports = {
  entry: {
    background: ['./src/background/index'],
    content_init: ['./src/content/loadfirst/index'],
    content_lytics: ['./src/content/loadlast/index'],
    interface: ['./src/interface/app/index.jsx'],
    settings: ['./src/settings/app/index.jsx'],
    stealth: ['./src/stealth/stealth']
  },

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        }
      }
    ]
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist/')
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new LiveReloadPlugin(),
    new CopyWebpackPlugin(
      [
        // interface
        {from:'src/interface/interface.html'},
        {from:'src/interface/jquery-3.1.1.min.js', to:'thirdparty/'},
        {from:'src/interface/legacy.js'},
        {from:'src/interface/img', to:'img/'},

        // settings
        {from:'src/settings/settings.html'},
        {from:'src/settings/img', to:'img/'},

        // core extension requirements
        {from:'src/base/icons', to:'icons/'},
        {from:'src/base/manifest.json'}
      ]
    )
  ],

  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],

  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.scss', '.sass'],
    root: [path.join(__dirname, './dist')]
  }
};
