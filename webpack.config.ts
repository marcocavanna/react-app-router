import { resolve } from 'path';

import { Configuration, DefinePlugin } from 'webpack';

import { Configuration as WebServerConfiguration } from 'webpack-dev-server';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';


/* --------
 * Export Shared Webpack Configuration
 * used for development and production build
 * -------- */
export default {

  /** Define the Context */
  context: resolve(__dirname, 'example'),

  /** Define default module resolution */
  resolve: {
    modules    : ['node_modules', resolve(__dirname, 'example')],
    extensions : ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
    alias: {
      MyComponent: resolve(__dirname, 'src')
    }
  },

  /** Define the Main Entry point */
  entry: {
    main: 'index.tsx'
  },

  /** Define build target */
  output: {
    path     : resolve(__dirname, 'compiled_example'),
    filename : 'lib/[name].bundle.js'
  },

  /** Define the compilation mode */
  mode: process.env.NODE_ENV === 'development'
    ? 'development'
    : 'production',

  /** Remove node dependencies for web */
  node: {
    child_process : 'empty',
    fs            : 'empty'
  },

  stats: 'normal',

  performance: {
    hints: 'warning'
  },

  devtool: 'source-map',

  /** Inject default plugins */
  plugins: [
    /** AutoInject into HTML */
    new HtmlWebpackPlugin({
      title    : 'Component Example',
      template : 'index.ejs',
      filename : 'index.html',
      base     : '/'
    }),

    /** Detect Circular Dependency */
    new CircularDependencyPlugin({
      exclude     : /node_modules/,
      failOnError : true,
      cwd         : process.cwd()
    }),

    /** Define NODE_ENV */
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV === 'development' ? 'development' : 'production')
    }),

    /** Extract CSS */
    new MiniCssExtractPlugin({
      filename       : 'style/[name].bundle.css'
    })
  ],

  /** Define default rules */
  module: {
    rules: [

      /** Use HTML */
      {
        test: /\.htm(l?)$/,
        use: [
          'html-loader'
        ]
      },

      /** Compile Typescript */
      {
        test    : /\.ts(x?)$/,
        exclude : /node_modules/,
        use     : [
          'ts-loader'
        ]
      },

      /** Enforce SourceMap processing */
      {
        test    : /\.js$/,
        enforce : 'pre',
        loader  : 'source-map-loader'
      },

      /** Append extra SCSS rules */
      {

        test: /\.scss$/,

        exclude: /node_modules/,

        use: [

          MiniCssExtractPlugin.loader,

          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: process.env.NODE_ENV === 'development',
              importLoaders: 2
            }
          },

          'postcss-loader',

          {
            loader: 'sass-loader',
            options: {
              sourceMap: process.env.NODE_ENV === 'development'
            }
          }

        ]

      }

    ],

  },

  /** Set Dev Server configuration */
  devServer: {
    historyApiFallback: true,
    host: '127.0.0.1',
    hot: true,
    https: true,
    inline: true,
    open: true,
    overlay: {
      errors: true,
      warnings: false
    },
    publicPath: '/'
  }

} as Configuration & { devServer: WebServerConfiguration };
