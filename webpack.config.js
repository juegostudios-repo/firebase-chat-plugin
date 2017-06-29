module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "build/bundle.js",
    libraryTarget: 'var',
    library: 'FirebaseChat'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }]
  }
}