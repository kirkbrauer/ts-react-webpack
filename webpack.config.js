var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin");

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  var config = {};

  config.devtool = 'source-map';
  config.entry = ['index.tsx'];
  config.output = {
    path: 'dist',
    publicPath: isProd
      ? '/'
      : 'http://localhost:8080/',
    filename: isProd
      ? '[name].[hash].min.js'
      : '[name].bundle.js',
    chunkFilename: isProd
      ? '[name].[hash].min.js'
      : '[name].bundle.js'
  };
  config.resolve = {
    extensions: [
      '', '.ts', '.tsx', '.js', '.jsx'
    ],
    modulesDirectories: ['src', 'node_modules']
  };
  config.module = {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel', 'ts-loader']
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file'
      }, {
        test: /\.html$/,
        loader: 'raw'
      }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  };
  config.plugins = [];
  
  config.plugins.push(
    new WebpackNotifierPlugin(
      {
        alwaysNotify: true
      }
    ),
    new BitBarWebpackProgressPlugin(),
    new HtmlWebpackPlugin(
      {
        template: './src/public/index.html',
        inject: 'body'
      }
    )
  );
    
  if (isProd) {
    config.plugins.push(
      //Supress Errors  
      new webpack.NoErrorsPlugin(),
      //Reduce filesize
      new webpack.optimize.DedupePlugin(),
      //Set react to production mode
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      //Compress and supress warnings
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      //Copy all assets excluding index.html to dist folder
      new CopyWebpackPlugin([
        {
          from: './src/public',
          ignore: ['index.html']
        }
      ]),
      //Add banner to the top of the generated files
      new webpack.BannerPlugin("Typescript React Webpack by Kirk Brauer")
    );
  }
  
  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
  };

  return config;
  
}();