var webpack = require('webpack');
 
module.exports = {
    //页面入口文件配置
    entry: {
        wheel : `${__dirname}/src/js/entry.js`
    },
    //入口文件输出配置
    output: {
        path: `${__dirname}/dist/wheel/js`,
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
             { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    babel: {
        presets: ['es2015','stage-3']
    },
    externals: {
        'd3': 'd3'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.ProvidePlugin({
            d3: 'd3'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};