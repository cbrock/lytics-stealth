const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path')

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?indentedSyntax=false&includePaths[]=' + path.resolve(__dirname, './src/browser_action')
]

module.exports = {
  entry: {
    app: ['./src/browser_action/app/index']
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
        },
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './src/browser_action/public'),
    publicPath: '/src/browser_action/public'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new LiveReloadPlugin()
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.sass'],
    root: [path.join(__dirname, './src/browser_action')]
  }
}