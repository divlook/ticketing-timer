'use strict'

const path = require('path')
const { ProgressPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const npmLifecycleEvent = process.env.npm_lifecycle_event
const isDevPhase = npmLifecycleEvent === 'dev'
const isBuildPhase = npmLifecycleEvent === 'build'

const config = {
    stats: 'minimal',
    resolve: {
        alias: {
            '@': rootDir('src'),
        },
        extensions: ['.js', '.json', '.ejs', 'html', '.css'],
    },
    entry: {
        app: rootDir('src/app.js'),
        main: rootDir('src/main.js'),
    },
    output: {
        filename: () => '[name].js',
        path: rootDir('build'),
        publicPath: '',
    },
    module: {
        rules: [],
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
        return devConfig()
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
    useDevServer()
    useBabel()
    useIndexHtml()
    // useCopyPlugin()
    useCssLoader(true)

    return config
}

function buildConfig(options) {
    config.plugins.push(new CleanWebpackPlugin())
    config.output.filename = (pathData) => {
        if (pathData.chunk.name === 'main') {
            return 'ticketing-timer.js'
        }

        return '[name].js'
    }

    if (options.outputPath) {
        config.output.path = rootDir(options.outputPath)
    }

    useBabel()
    useIndexHtml()
    // useCopyPlugin()
    useMomentLocalesPlugin()
    useCssLoader()

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
    const title = 'Ticketing Timer'

    config.plugins.push(
        new HtmlWebpackPlugin({
            title,
            inject: 'head',
            template: rootDir('public/index.ejs'),
            minify: false,
            templateParameters: {
                title,
                publicPath,
            },
            chunks: ['main', 'app'],
            chunksSortMode: 'manual',
            hash: true,
        })
    )
}

function useCopyPlugin() {
    config.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                    from: rootDir('public/**/*'),
                    context: 'public/',
                    globOptions: {
                        ignore: ['**/*.html', '**/*.ejs'],
                    },
                },
            ],
        })
    )
}

function useDevServer() {
    config.devServer = {
        contentBase: [
            rootDir('build'),
            rootDir('public'),
            //
        ],
        port: 9000,
        host: '0.0.0.0',
        hot: true,
    }
}

function useMomentLocalesPlugin() {
    config.plugins.push(
        new MomentLocalesPlugin({
            localesToKeep: ['es-us', 'ko'],
        })
    )
}

function useCssLoader(isDev = false) {
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        })
    )

    config.module.rules.push({
        test: /\.css$/i,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: isDev,
                },
            },
            'css-loader',
            'postcss-loader',
        ],
    })
}

function useBabel() {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    })
}
