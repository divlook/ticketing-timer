const path = require('path')
const { ProgressPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const npmLifecycleEvent = process.env.npm_lifecycle_event
const isDevPhase = npmLifecycleEvent === 'dev'
const isBuildPhase = npmLifecycleEvent === 'build'

const config = {
    stats: 'minimal',
    resolve: {
        alias: {
            '@': rootDir('src'),
        },
    },
    entry: rootDir('src/main.js'),
    output: {
        filename: 'main.js',
        path: rootDir('dist'),
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        ],
    },
    plugins: [new ProgressPlugin()],
    optimization: {},
}

module.exports = function () {
    if (isDevPhase) {
        return devConfig()
    }

    if (isBuildPhase) {
        return buildConfig()
    }

    return config
}

function rootDir(...p) {
    return path.resolve(__dirname, ...p)
}

function devConfig() {
    config.devServer = {
        contentBase: [
            rootDir('dist'),
            rootDir('public'),
        ],
        port: 9000,
    }

    config.plugins.push(
        new HtmlWebpackPlugin({
            inject: 'head',
            template: rootDir('public/index.html'),
        })
    )

    return config
}

function buildConfig() {
    config.plugins.push(new CleanWebpackPlugin())
    config.output.filename = 'ticketing.js'
    return config
}
