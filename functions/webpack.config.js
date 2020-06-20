/* eslint-env node */

const {resolve} = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Assume version as git describe
 * @see https://medium.com/bind-solution/dynamic-version-update-with-git-describe-477e8cd2a306
 */
const gitRevisionPlugin = new GitRevisionPlugin();

const srcFolder = resolve('src');
const srcClientFolder = resolve('../src');

module.exports = function (env, args) {
    const mode = args.mode || 'development'
    const appVersion = gitRevisionPlugin.version();
    console.log('Building functions "%s" with webpack in "%s" mode', appVersion, mode);

    return {
        target: 'node',
        entry: {
            index: srcFolder
        },
        cache: true,
        mode: 'production',
        devtool: 'inline-source-map',
        output: {
            path: resolve('dist'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/public',
            sourceMapFilename: '[name].js.map',
            pathinfo: false,
            libraryTarget: 'commonjs2',
            // libraryTarget: 'this',
            globalObject: "(typeof window !== 'undefined' ? window : this)",
        },
        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development',
                VERSION: appVersion,
                CI: false,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: '../public/', to: '../dist/public/' },
                ],
            }),
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(appVersion),
                __DEVELOPMENT__: JSON.stringify(mode === 'development'),
                __PRODUCTION__: JSON.stringify(mode === 'production'),
            }),
            new webpack.HashedModuleIdsPlugin(),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/i,
                    exclude: /node_modules|dist|vendors|public/,
                    include: [srcFolder, srcClientFolder],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // important for performance
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    include: [srcFolder, srcClientFolder, /uikit/],
                    use: { loader: "ignore-loader" },
                }
            ]
        },
        node: {
            global: false,
            __filename: false,
            __dirname: false,
        },
        stats: {
            // Examine all modules
            maxModules: Infinity,
            // Display bailout reasons
            // optimizationBailout: true,
        },
    }

}













