// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: './src/index.slim',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.slim$/,
        use: [
          'html-loader',
          {
            loader: 'slim-lang-loader',
            options: {
              // 여기에 추가적인 Slim 옵션을 설정할 수 있습니다.
              trace: true,
            //   pretty: true
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.slim',
      minify: {
        collapseWhitespace: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/layout/pc.slim',
      minify: {
        collapseWhitespace: false,
      },
    }),
  ],
};
