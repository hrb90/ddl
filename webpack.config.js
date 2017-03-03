module.exports = {
  context: __dirname,
  entry: "./scripts/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["*", ".js"]
  }
};
