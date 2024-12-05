const path = require('path');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TranspilePlugin = require('transpile-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
require('dotenv').config(); // 加载 .env 文件
const NODE_ENV = process.env.NODE_ENV;
// const webpack = require('webpack');  // 确保导入了 webpack,否则不能进行热更新
// const WriteFilePlugin = require('write-file-webpack-plugin');//将文件写入磁盘
const config = {
    // Start mode / environment
    mode: NODE_ENV,

    // Entry files
    entry: [
        // 'webpack-hot-middleware/client?reload=true', // 启用热加载
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

    cache: {
        type: 'filesystem',//开启持久缓存
        buildDependencies: {
            config: [path.join(__dirname, 'webpack.config.js')],
        },
    },

    // Module/Loaders configuration
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                // exclude: /node_modules/,
                exclude: [
                    /node_modules/,
                    /server/,
                    /dist/
                ],
                // use: 'babel-loader',
                use: [
                    'thread-loader', // 并行处理
                    'babel-loader'
                ]
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
            minify: NODE_ENV==='production',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles-[chunkhash:8].css',
        }),
        NODE_ENV==='production' && new ReplaceInFileWebpackPlugin([
            {
                dir: path.resolve(__dirname, 'dist'),
                test: /\.js$/,
                rules: [
                    {
                        search: 'http://localhost:8080',
                        replace: 'http://www.kongzhijie.cn:8080'
                    }
                ]
            }
        ]),
        // new webpack.HotModuleReplacementPlugin(), // HMR 插件 部署项目出现__webpack_hmr,所以需要注释
        // new WriteFilePlugin()//将文件写入磁盘
    ],

    // Webpack chunks optimization
    optimization: {
        usedExports: true,//静态分析移除未使用代码的技术
        concatenateModules: true,//Scope Hoisting 是 Webpack 的一项优化技术，它通过重新排序和合并模块来减少打包文件中的函数作用域数量。
        minimize: true,//压缩代码js,css
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(),
        ],
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
        port: process.env.NODE_PORT,
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
