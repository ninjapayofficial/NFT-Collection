const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output bundle
    path: path.resolve(__dirname, 'dist'), // Output directory
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader' // Use Babel loader
        }
      }
    ]
  },
  devServer: {
    static: './dist', // Serve files from the dist directory
    hot: true // Enable hot module replacement
  },
  mode: 'development' // Set the mode to development
};
