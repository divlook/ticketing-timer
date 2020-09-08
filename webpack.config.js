'use strict'

/**
 * @typedef Options
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
        'plugins/highlight.module': '@/plugins/highlight.module',
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

/**
 * @type { Options }
 */
const options = {
    outputPath: null,
    publicPath: null,
    envMode: setEnvMode(),
}

module.exports = function (env, argv) {
    options.outputPath = isNullish(argv['output-path'])
    options.publicPath = isNullish(argv['public-path'])
    options.envMode = setEnvMode(argv['env-mode'])

    useDefinePlugin()
    useBabel()
    useIndexHtml()
    useCopyPlugin()
    useWorker()

    if (options.publicPath) {
        config.output.publicPath = options.publicPath
    }

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
    useDevServer()
    useCssLoader(true)

    return config
}

function buildConfig() {
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
                TITLE: title,
                PUBLIC_PATH: publicPath,
                ENV_MODE: options.envMode,
            },
            chunks: ['main', 'app'],
            chunksSortMode: 'manual',
            hash: true,
        })
    )
}

function useCopyPlugin() {
    const isChromeMode = options.envMode === 'chrome'
    const patterns = []

    patterns.push(usePublicDir())

    if (isChromeMode) {
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
            from: 'src/manifest.chrome.json',
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
        contentBase: [rootDir('public')],
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
        })
    )
}

function setEnvMode(value) {
    if (value === 'chrome') {
        return 'chrome'
    }

    return 'web'
}
