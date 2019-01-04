/* eslint-disable no-undef */
const path = require('path');
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
        new VueLoaderPlugin()
    ]
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: !isDevelopment
    }
};

module.exports = {
    'webpack.extend': config => {
        const postCssRule = {
            test: /\.css$/,
            exclude: config.get('webpack.commonExcludes')
        };

        postCssRule.use = [
            postcssLoader
        ];
        part.module.rules.push(postCssRule);

        return part
    }
};
