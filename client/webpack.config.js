const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "production";

const SRC_DIR = path.resolve(__dirname, "src");
const DIST_DIR = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/index.tsx",
  mode,
  output: {
    filename: "bundle.js",
    path: DIST_DIR,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIR, "index.html"),
    }),
  ],
  devtool: mode === "development" ? "source-map" : false,
  devServer: {
    compress: true,
    port: 9000,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:8080",
      },
    ],
  },
};
