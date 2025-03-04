var webpack = require('webpack');
var path = require('path');

//var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
//var APP_DIR = path.resolve(__dirname, 'src/client/app');

var APP_DIR = path.resolve(__dirname, '');
var BUILD_DIR = APP_DIR;

var config = {
    entry: APP_DIR + '/src/index.jsx',
    output: {
        path: BUILD_DIR + '/js/',
        filename: 'bundle.js'
    },
    module : {

        rules: [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]

    },
    stats: 'errors-only'
};

module.exports = config;
