const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const bootstrapEntryPoints = require('./webpack.bootstrap.config');

const isProd = process.env.NODE_ENV === 'production'; //true or false
const cssDev = ['style-loader', 'css-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader'],
    publicPath: '/dist'
})

const cssConfig = isProd ? cssProd : cssDev;

// const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    devtool: 'source-map',
    entry: {
        bundle: './src/main.js',
       // bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                use: cssProd// !!!! change this to cssConfig for HotMode
            },
            // {
            //     test: /\.(jpe?g|png|gif|svg)$/i,
            //     use: [
            //         'file-loader?name=images/[name].[ext]',
            //         // 'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/'
            //         'image-webpack-loader'
            //     ]
            // },
            // { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000' },
            // { test: /\.(ttf|eot)$/, loader: 'file-loader' },
            // Bootstrap 3
            // { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
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
            template: './src/index.html'
        }),
        new ExtractTextPlugin('styles.css', {
            disabled: false, // !!!! change this to !isProd for HotMode
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
        // !!!! uncomment this
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ]
}

