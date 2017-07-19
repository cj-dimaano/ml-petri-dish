/*******************************************************************************
@file `webpack.config.js`
  Created July 19, 2017

@author CJ Dimaano
  <c.j.s.dimaano@gmail.com>
*******************************************************************************/

module.exports = {
  entry: {
    index: "./src/index"
  },
  output: {
    filename: "index.js"
  },
  node: {
    __dirname: false
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
}
