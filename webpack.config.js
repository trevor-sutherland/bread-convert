const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// GitHub Pages project site is served from /<repo>/
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const publicPath = isGitHubPages ? '/bread-convert/' : '/';

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath,
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                type: 'asset/resource',
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ],
    },
    mode: isGitHubPages ? 'production' : 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000,
        host: '0.0.0.0',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.PUBLIC_URL': JSON.stringify(publicPath.replace(/\/$/, '')),
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.template.html',
            title: 'Bread Convert',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/breadRecipes.json' },
                { from: 'public/favicon.ico' },
                { from: 'public/logo192.png' },
                { from: 'public/logo512.png' },
                { from: 'public/manifest.json' },
                { from: 'public/robots.txt' },
            ],
        }),
    ],
};
