const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const babelPreset = require('babel-preset-backpack')
const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const rootPath = path.resolve(process.cwd())
const buildPath = path.join(rootPath, 'build')
const publicBuildPath = path.join(buildPath, 'public')

const config = {
  rootPath,
  buildPath,
  publicBuildPath,
  publicSrcPath: path.join(rootPath, 'public'),
  serverSrcPath: path.join(rootPath, 'src'),
  serverBuildPath: buildPath,
  userNodeModulesPath: path.join(rootPath, 'node_modules'),
  publicPath: '/',
  serverUrl: 'http://localhost:3000'
}



// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
module.exports = function (options) {
  const babelRcPath = path.resolve('.babelrc')
  const hasBabelRc = fs.existsSync(babelRcPath)
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: []
  }

  if (hasBabelRc) {
    console.log('> Using .babelrc defined in your app root')
  } else {
    mainBabelOptions.presets.push(babelPreset)
  }

  return {
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: 'node',
    // The benefit of Webpack over just using babel-cli or babel-node
    // command is sourcemap support. Although it slows down compilation,
    // it makes debugging dramatically easier.
    devtool: 'source-map',
    // Webpack allows you to define externals - modules that should not be
    // bundled. When bundling with Webpack for the backend - you usually
    // don't want to bundle its node_modules dependencies. This creates an externals
    // function that ignores node_modules when bundling in Webpack.
    // @see https://github.com/liady/webpack-node-externals
    externals: nodeExternals({
      whitelist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|less|styl)$/,
      ]
    }),
    // As of Webpack 2 beta, Webpack provides performance hints.
    // Since we are not targeting a browser, bundle size is not relevant.
    // Additionally, the performance hints clutter up our nice error messages.
    performance: {
      hints: false
    },
    // Since we are wrapping our own webpack config, we need to properly resolve
    // Backpack's and the given user's node_modules without conflict.
    resolve: {
      extensions: ['.ls', '.js', '.json'],
      modules: [config.userNodeModulesPath, path.resolve(__dirname, '../node_modules')]
    },
    resolveLoader: {
      modules: [config.userNodeModulesPath, path.resolve(__dirname, '../node_modules')]
    },
    node: {
      __filename: true,
      __dirname: true
    },
    entry: {
      main: [
        `${config.serverSrcPath}/index.js`
      ],
    },
    // This sets the default output file path, name, and compile target
    // module type. Since we are focused on Node.js, the libraryTarget
    // is set to CommonJS2
    output: {
      path: config.serverBuildPath,
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: config.publicPath,
      libraryTarget: 'commonjs2'
    },
    // Define a few default Webpack loaders. Notice the use of the new
    // Webpack 2 configuration: module.rules instead of module.loaders

    module: {
      rules: [
        {
          test: /\.ls$/,
          exclude: /node_modules/,
          loader: 'livescript-loader'
        },
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [
            /node_modules/,
            config.buildPath
          ],
          options: mainBabelOptions
        }
      ]
    },
    optimization: {

	    // The NoEmitOnErrorsPlugin plugin prevents Webpack
	    // from printing out compile time stats to the console.
	    // noEmitOnErrors: true, // NoEmitOnErrorsPlugin

	    // namedModules: true, // NamedModulesPlugin()

	    // splitChunks: { // CommonsChunkPlugin()
	    //     name: 'vendor',
	    //     minChunks: 2
	    // },

	    // concatenateModules: true //ModuleConcatenationPlugin
	},
    plugins: [
      // We define some sensible Webpack flags. One for the Node environment,
      // and one for dev / production. These become global variables. Note if
      // you use something like eslint or standard in your editor, you will
      // want to configure __DEV__ as a global variable accordingly.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.env),
        '__DEV__': options.env === 'development'
      }),
      // In order to provide sourcemaps, we automagically insert this at the
      // top of each file using the BannerPlugin.
      new webpack.BannerPlugin({
        raw: true,
        entryOnly: false,
        banner: `require('${
          // Is source-map-support installed as project dependency, or linked?
          ( require.resolve('source-map-support').indexOf(process.cwd()) === 0 )
            // If it's resolvable from the project root, it's a project dependency.
            ? 'source-map-support/register'
            // It's not under the project, it's linked via lerna.
            : require.resolve('source-map-support/register')
        }')`
      }),
      // The FriendlyErrorsWebpackPlugin (when combined with source-maps)
      // gives Backpack its human-readable error messages.
      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === 'development',
      })

    ]
  }
}