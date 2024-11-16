'use strict'

/**
 * @typedef Options
 * @property { string } [title]
 * @property { string } [outputPath]
 * @property { string } [publicPath]
 * @property { 'chrome' | 'web' } [envMode]
 */

const path = require('path')
const { ProgressPlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { version } = require('./package.json')
const npmLifecycleEvent = process.env.npm_lifecycle_event

const state = {
    isDevPhase: npmLifecycleEvent === 'dev',
    isBuildPhase: npmLifecycleEvent === 'build',
    isChromeMode: false,
}

const config = {
    stats: 'minimal',
    resolve: {
        alias: {
            '@': rootDir('src'),
        },
        extensions: [
            '.js',
            '.json',
            '.ejs',
            '.html',
            '.css',
            '.scss',
            //
        ],
    },
    entry: {},
    output: {
        filename: () => '[name].js',
        path: rootDir('build'),
        publicPath: '',
    },
    module: {
        rules: [],
    },
    plugins: [],
    optimization: {},
}

/**
 * @type { Options }
 */
const options = {
    title: 'Ticketing Timer',
    outputPath: null,
    publicPath: null,
    envMode: setEnvMode(),
}

module.exports = function (env) {
    options.title = isNullish(env['title'], options.title)
    options.outputPath = isNullish(env['output-path'])
    options.publicPath = isNullish(env['public-path'])
    options.envMode = setEnvMode(env['env-mode'])
    state.isChromeMode = options.envMode === 'chrome'

    config.plugins.push(new ProgressPlugin())

    useDefinePlugin()
    useBabel()
    useIndexHtml()
    useCopyPlugin()
    useWorker()

    if (options.publicPath) {
        config.output.publicPath = options.publicPath
    }

    if (state.isDevPhase) {
        return devConfig()
    }

    if (state.isBuildPhase) {
        return buildConfig()
    }

    return config
}

function rootDir(...p) {
    return path.resolve(__dirname, ...p)
}

function devConfig() {
    useEntry()
    useDevServer()
    useCssLoader(true)

    config.module.rules.push({
        test: /\.ejs$/,
        use: [
            {
                loader: 'ejs-loader',
                options: {
                esModule: false,
                },
            },
        ],
    })

    return config
}

function buildConfig() {
    config.plugins.push(new CleanWebpackPlugin())
    config.output.filename = (pathData) => {
        if (pathData.chunk.name === 'main') {
            return '[name].[contenthash].js'
        }
        return '[name].js'
    }

    if (options.outputPath) {
        config.output.path = rootDir(options.outputPath)
    }

    useEntry()
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

function useEntry() {
    if (state.isChromeMode) {
        config.entry = {
            'chrome/background': rootDir('src/chrome/background.js'),
            'chrome/content-script': rootDir('src/chrome/content-script.js'),
            'plugins/highlight.module': '@/plugins/highlight.module',
        }
        return
    }

    config.entry = {
        main: rootDir('src/main.js'),
        'ticketing-timer.module': rootDir('src/ticketing-timer.js'),
        'ticketing-timer.script': rootDir('src/ticketing-timer.script.js'),
        'plugins/highlight.module': '@/plugins/highlight.module',
    }
}

function useIndexHtml() {
    const publicPath = config.output.publicPath

    if (state.isChromeMode) {
        return
    }

    config.plugins.push(
        new HtmlWebpackPlugin({
            title: options.title,
            inject: 'head',
            template: rootDir('public/index.ejs'),
            minify: false,
            templateParameters: {
                TITLE: options.title,
                PUBLIC_PATH: publicPath,
                ENV_MODE: options.envMode,
            },
            chunks: ['main'],
            chunksSortMode: 'manual',
        })
    )
}

function useCopyPlugin() {
    const patterns = []

    patterns.push(usePublicDir())

    if (state.isChromeMode) {
        patterns.push(useChromeManifest())
    }

    config.plugins.push(
        new CopyPlugin({
            patterns,
        })
    )

    function usePublicDir() {
        return {
            from: rootDir('public/**/*'),
            context: 'public/',
            globOptions: {
                ignore: [
                    '**/*.html',
                    '**/*.ejs',
                    //
                ],
            },
        }
    }

    function useChromeManifest() {
        return {
            from: 'src/chrome/manifest.json',
            to: 'manifest.json',
            transform(content) {
                const manifest = JSON.parse(content.toString())
                manifest.version = version
                return JSON.stringify(manifest, null, 4)
            },
        }
    }
}

function useDevServer() {
    config.devServer = {
        static: {
            directory: rootDir('public'),
        },
        port: 9000,
        host: '0.0.0.0',
        hot: true,
    }
}

function useMomentLocalesPlugin() {
    config.plugins.push(
        new MomentLocalesPlugin({
            localesToKeep: ['ko'],
        })
    )
}

function useCssLoader(isDev = false) {
    if (!isDev) {
        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: state.isChromeMode
                    ? 'styles/[name].css'
                    : 'styles/[name].[contenthash].css',
            })
        )
    }

    config.module.rules.push({
        test: /\.css$/i,
        use: [
            useMiniCssExtractPlugin(isDev),
            'css-loader',
            'postcss-loader',
            //
        ],
    })

    config.module.rules.push({
        test: /\.s[ac]ss$/i,
        use: [
            useMiniCssExtractPlugin(isDev),
            'css-loader',
            'sass-loader',
            'postcss-loader',
            //
        ],
    })

    function useMiniCssExtractPlugin(isDev = false) {
        return isDev ? 'style-loader' : MiniCssExtractPlugin.loader
    }
}

function useBabel() {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    })
}

function useWorker() {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: ['worker-loader', 'babel-loader'],
    })
}

function useDefinePlugin() {
    config.plugins.push(
        new DefinePlugin({
            ENV_MODE: JSON.stringify(options.envMode),
            TITLE: JSON.stringify(options.title),
        })
    )
}

function setEnvMode(value) {
    if (value === 'chrome') {
        return 'chrome'
    }

    return 'web'
}
