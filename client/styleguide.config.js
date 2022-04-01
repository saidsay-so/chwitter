const webpack = require("webpack");
const { merge } = require("webpack-merge");
const defaultConfig = require("react-scripts/config/webpack.config");

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.md$/,
        type: "javascript/dynamic",
      },
    ],
  },
  plugins: [
    // Rewrites the absolute paths to those two files into relative paths
    new webpack.NormalModuleReplacementPlugin(
      /react-styleguidist\/lib\/loaders\/utils\/client\/requireInRuntime$/,
      "react-styleguidist/lib/loaders/utils/client/requireInRuntime"
    ),
    new webpack.NormalModuleReplacementPlugin(
      /react-styleguidist\/lib\/loaders\/utils\/client\/evalInContext$/,
      "react-styleguidist/lib/loaders/utils/client/evalInContext"
    ),
  ],
};

const finalConfig = merge(webpackConfig, defaultConfig("development"));
console.log(require("util").inspect(finalConfig, false, 10));

module.exports = {
  webpackConfig: finalConfig,
};
