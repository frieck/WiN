const helpers = require('./../helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'main': './src/desktop.ts'
    },

    target: 'electron',

    node: {
        __dirname: false
    },

    output: {
        path: helpers.root('build'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [{
            test: /\.ts$/,
            loaders: 'awesome-typescript-loader'
        }]
    },

    plugins: [
        /*
         * Plugin: CopyWebpackPlugin
         * Description: Copy files and directories in webpack.
         *
         * Copies project static assets.
         *
         * See: https://www.npmjs.com/package/copy-webpack-plugin
         */
        new CopyWebpackPlugin([
            { from: 'src/icons', to: 'icons' }
        ]),
    ],

};