const path = require('path')

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'env'
            // old:['latest', { modules: false }],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  }
}

const index = {
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.js',
        library: "ubiiTopicData",
        libraryTarget: "commonjs2"
    }
};


module.exports = [
  Object.assign({} , commonConfig, index)
];