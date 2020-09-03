const path = require('path')
const { ProgressPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

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
        path: rootDir('build'),
        publicPath: '',
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        ],
    },
    plugins: [new ProgressPlugin()],
    optimization: {},
}

const options = {
    outputPath: null,
    publicPath: null,
}

module.exports = function (env, argv) {
    options.outputPath = isNullish(argv['output-path'])
    options.publicPath = isNullish(argv['public-path'])

    if (options.publicPath) {
        config.output.publicPath = options.publicPath
    }

    if (isDevPhase) {
        return devConfig(options)
    }

    if (isBuildPhase) {
        return buildConfig(options)
    }

    return config
}

function rootDir(...p) {
    return path.resolve(__dirname, ...p)
}

function devConfig() {
    config.devServer = {
        contentBase: [
            rootDir('build'),
            rootDir('public'),
            //
        ],
        port: 9000,
        host: '0.0.0.0',
    }

    useIndexHtml()

    return config
}

function buildConfig(options) {
    config.plugins.push(new CleanWebpackPlugin())
    config.output.filename = 'ticketing.js'

    if (options.outputPath) {
        config.output.path = options.outputPath
    }

    useIndexHtml()
    useCopyPlugin(options)

    return config
}

function isNullish(value, then = null) {
    if (value === null || value === undefined) {
        return then
    }

    return value
}

function useIndexHtml() {
    const publicPath = config.output.publicPath

    config.plugins.push(
        new HtmlWebpackPlugin({
            inject: 'head',
            template: rootDir('public/index.html'),
            minify: false,
            templateParameters: {
                publicPath,
            },
        })
    )
}

function useCopyPlugin(options) {
    const outputPath = options.outputPath || rootDir('build')

    config.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                    from: rootDir('public/**/*'),
                    to: outputPath,
                    context: rootDir('public'),
                    globOptions: {
                        ignore: ['**/*.html'],
                    },
                },
            ],
        })
    )
}
