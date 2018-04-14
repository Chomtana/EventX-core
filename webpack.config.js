const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './src/main.js',
  mode: 'development',
  output: {
    filename: 'evx.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window',
    library: 'evx'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    /*new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })*/
  ]
};
