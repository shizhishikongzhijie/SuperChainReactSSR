const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TranspilePlugin = require('transpile-webpack-plugin');
const IS_PROD = process.env.NODE_ENV;
const webpack = require('webpack');  // 确保导入了 webpack,否则不能进行热更新
const WriteFilePlugin = require('write-file-webpack-plugin');//将文件写入磁盘
const config = {
    // Start mode / environment
    mode: IS_PROD ? 'production' : 'development',

    // Entry files
    entry: [
        'webpack-hot-middleware/client?reload=true', // 启用热加载
        path.resolve(__dirname, 'src/index'),
    ],

    // Output files and chunks
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-[chunkhash:8].js',
    },

    // Resolve files configuration
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss'],
    },

    // Module/Loaders configuration
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.module.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            },
                            sourceMap: true,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                //svg
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            babel: false,
                        },
                    },
                ],
            }
        ],
    },

    // Plugins
    plugins: [
        new WebpackBar(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'public/index.html'),
            minify: IS_PROD,
        }),
        new MiniCssExtractPlugin({
            filename: 'styles-[chunkhash:8].css',
        }),
        new webpack.HotModuleReplacementPlugin(), // HMR 插件
        new WriteFilePlugin()//将文件写入磁盘
    ],

    // Webpack chunks optimization
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                venders: false,

                vendor: {
                    chunks: 'all',
                    name: 'vender',
                    test: /node_modules/,
                },

                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },

    // DevServer for development
    devServer: {
        port: 9000,
        historyApiFallback: true,
    },
    // Generate source map
    devtool: 'source-map',
    // watch: true,  // 启用监听模式
    // watchOptions: {
    //     ignored: /node_modules|dist/,  // 忽略 node_modules 和 dist 文件夹
    //     aggregateTimeout: 100,  // 文件变化后等待 300 毫秒再重新编译
    //     poll: 1000  // 每 1000 毫秒轮询一次文件变化
    // }
};

module.exports = config;
