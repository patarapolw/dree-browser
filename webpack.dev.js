const common = require("./webpack.common");
const webpack = require("webpack");
const dree = require("dree");
const dotenv = require("dotenv");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
dotenv.config();

common.plugins.push(...[
    new webpack.DefinePlugin({
        DREE: JSON.stringify(dree.scan(process.env.DREE || "."))
    }),
    new CopyWebpackPlugin([
        "./public"
    ])
])

module.exports = {
    ...common,
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        watchContentBase: true,
        contentBase: "public",
        open: true
    },
    entry: {
        index: path.resolve(__dirname, "src/index.ts")
    },
};