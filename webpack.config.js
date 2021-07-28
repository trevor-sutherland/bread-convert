const path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry : './src/index.js',
    devtool: 'source-map',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'bundle.js'
    },
    module: {rules: [
        {
          test: /\.js$/,
    
          use: {
            loader : 'babel-loader',
            options: {presets: [ '@babel/preset-env', '@babel/preset-react' ]},
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          type: 'asset/resource',
        },
        {test : /\.css$/, use:['style-loader', 'css-loader']}
    ],
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
            template : 'public/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: 'public/breadRecipes.json'
                }
            ]
        })
    ]
    

}