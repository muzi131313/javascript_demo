var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    entry: APP_PATH,
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'index'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        // progress: true
    },
    module: {
        rules: [{
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }, {
          test: /\.(png|jpg)$/,
          use: "url-loader?limit=40000"
        }, {
          test: /\.js$/,
          use: "jsx-loader"
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
