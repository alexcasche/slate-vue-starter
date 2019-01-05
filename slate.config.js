/* eslint-disable no-undef */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const rimraf = require("rimraf");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const isDevelopment = process.env.NODE_ENV === 'development';

const alias = {
    jQuery: path.resolve('./node_modules/jquery'),
    $: path.resolve('./node_modules/jquery'),
};

const part = {
    resolve: {
        alias,
        extensions: ['.js', '.css', '.json', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
              from: 'sections/**/*',
              to: '../sections/',
              flatten: true
            },
            {
                from: 'snippets/**/*',
                to: '../snippets/',
                flatten: true
              }
        ]),
        new WebpackOnBuildPlugin(function(stats) {
            rimraf("./dist/sections/!(*.liquid)", function () { 
                console.log("removed section subfolders"); 
            });
            rimraf("./dist/snippets/!(*.liquid)", function () { 
                console.log("removed snippets subfolders"); 
            });
        })
    ]
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: !isDevelopment
    }
};

const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: !isDevelopment
    }
}

module.exports = {
    'webpack.extend': config => {
        const postCssRule = {
            test: /\.css$/,
            exclude: config.get('webpack.commonExcludes')
        };
        postCssRule.use = [
            resolveUrlLoader,
            postcssLoader
        ];
        part.module.rules.push(postCssRule);
        return part
    }
};
