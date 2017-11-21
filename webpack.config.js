const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');

const isProd = process.env.NODE_ENV === 'production'; //true or false
const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','sass-loader'],
    publicPath: '/dist'
})

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    devtool: 'source-map',
    entry: {
        bundle: './src/main.js',
        // contact: './src/contact.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ["env"]}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: cssConfig// !!!! change this to cssConfig for HotMode
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    // 'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/'
                    'image-webpack-loader'
                ]
            },
            { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
            //Bootstrap 3
            { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        // !!!! change this to hot:true for HotMode
        stats: 'errors-only',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Promokodus',
            hash: true,
            excludeChunks: ['contact'],
            template: './src/index.html'
        }),
        // new HtmlWebpackPlugin({
        //     title: 'Contact Page',
        //     hash: true,
        //     chunks: ['contact'],
        //     filename: 'contact.html',
        //     template: './src/contact.html'
        // }),
        new ExtractTextPlugin('/css/[name].css', {
            disabled: !isProd, // !!!! change this to !isProd for HotMode
            allChunks: true
        }),
        // !! maybe not need any more
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery'",
        //     "window.$": "jquery"
        // }),
        // !!!! uncomment this
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}

