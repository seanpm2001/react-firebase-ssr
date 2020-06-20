/* eslint-env node */

const {join, resolve} = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const fs = require('fs');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const webpackDevelopmentConfig = require('./webpack.development.js')
const webpackProductionConfig = require('./webpack.production.js')

require('dotenv').config();

/**
 * Assume verion as git describe
 * @see https://medium.com/bind-solution/dynamic-version-update-with-git-describe-477e8cd2a306
 */
const gitRevisionPlugin = new GitRevisionPlugin();

const srcFolder = resolve(__dirname, 'src');

module.exports = function (env, args) {
    const mode = args.mode || 'development'
    const appVersion = gitRevisionPlugin.version();
    console.log('Building version "%s" with webpack in "%s" mode', appVersion, mode);

    const defaultConfig = {
        target: 'web',
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {from: './src/assets/icons/favicon.ico', to: './'},
                    {from: './src/assets/icons/favicon16x16.png', to: './'},
                    {from: './src/assets/icons/favicon32x32.png', to: './'},
                ],
            }),
            new MiniCssExtractPlugin({
                publicPath: 'styles/',
                ignoreOrder: true,
                filename:
                    mode === 'production'
                        ? '[name]-[contenthash].css'
                        : '[name].css',
                chunkFilename:
                    mode === 'production'
                        ? '[id]-[contenthash].css'
                        : '[id].css',
            }),
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development',
                VERSION: appVersion,
                FIREBASE_APPID: '',
                FIREBASE_AUTHDOMAIN: '',
                FIREBASE_DATABASEURL: '',
                FIREBASE_PROJECTID: '',
                FIREBASE_STORAGEBUCKET: '',
                FIREBASE_MESSAGINGSENDERID: '',
                FIREBASE_MEASUREMENTID: '',
                FIREBASE_API_KEY: '',
            }),
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(appVersion),
                __DEVELOPMENT__: JSON.stringify(mode === 'development'),
                __PRODUCTION__: JSON.stringify(mode === 'production'),
            }),
            new HtmlWebpackPlugin({
                filename: 'client.html',
                title: 'react-firebase-ssr',
                favicon: resolve(srcFolder, 'assets/icons/favicon.ico'),
                template: resolve(__dirname, 'src', 'index.ejs'),
                minify: {collapseWhitespace: true},
                inlineSource: 'runtime.+\\.js',
                inject: true,
                inline: fs.readFileSync(
                    'src/assets/first-input-delay.min.js',
                    'utf8'
                ),
            }),
            new FaviconsWebpackPlugin({
                logo: './src/assets/icons/favicon.svg',
                cache: true,
                inject: true,
                favicons: {
                    appName: 'react-firebase-ssr',
                    appDescription: 'React template with SSR by using Firebase',
                    developerName: 'ridermansb',
                    background: '#fff',
                    theme_color: '#333',
                    icons: {
                        coast: false,
                        yandex: false
                    }
                }
            }),
            new WebpackPwaManifest({
                name: 'react-firebase-ssr',
                fingerprints: true,
                inject: true,
                short_name: 'react-firebase-ssr',
                description: 'React template with SSR by using Firebase',
                background_color: '#fff',
                start_url: '/?utm_source=a2hs&utm_medium=pwa',
                crossorigin: 'use-credentials',
                theme_color: '#fff',
                orientation: 'any',
                display: 'standalone',
                icons: [
                    {
                        src: resolve('src/assets/icons/favicon.png'),
                        sizes: [120, 152, 167, 180, 1024],
                        destination: join('icons', 'ios'),
                        ios: true,
                    },
                    {
                        src: resolve('src/assets/icons/favicon.png'),
                        size: 1024,
                        destination: join('icons', 'ios'),
                        ios: 'startup',
                    },
                    {
                        src: resolve('src/assets/icons/favicon.png'),
                        sizes: [36, 48, 72, 96, 144, 192, 512],
                        destination: join('icons', 'android'),
                    },
                    {
                        src: resolve('src/assets/icons/maskable.png'),
                        sizes: "196x196",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ],
            }),
            new webpack.HashedModuleIdsPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/i,
                    exclude: /node_modules|dist|vendors/,
                    include: [srcFolder],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // important for performance
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    include: [srcFolder, /uikit/],
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: false, // mode !== 'production' || process.env.NODE_ENV === 'development',
                                esModule: true,
                                reloadAll: true,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {sourceMap: true, modules: false},
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                ident: 'postcss',
                            },
                        },
                    ],
                },
                {
                    test: /\.(gif|png|jpe?g)$/i,
                    use: {
                        loader: 'file-loader',
                        query: {outputPath: 'assets/images/'},
                    },
                },
                {
                    test: /\.svg$/i,
                    loader: 'svg-inline-loader',
                },
            ]
        },
        stats: {
            // Examine all modules
            maxModules: Infinity,
            // Display bailout reasons
            // optimizationBailout: true,
        },
    };

    const modeConfig = {
        production: webpackProductionConfig(appVersion),
        development: webpackDevelopmentConfig
    }

    return merge.smart(defaultConfig, modeConfig[mode] || {});

}
