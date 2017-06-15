/**
 * Created by zhengqiguang on 2017/6/15.
 */

let rollupPluginBabel = require("rollup-plugin-babel");

let server = require("rollup-plugin-serve");
let watch = require("rollup-watch");

module.exports = {
    entry: "./src/index.js",
    dest: "./dist/dev/bundle.js",
    format: "umd",
    moduleName: 'QV',
    sourceMap: true,
    sourceMapFile: '/dist/bundle.js.map',
    plugins: [
        rollupPluginBabel({
            exclude: 'node_modules/**'
        }),
        server({
            // Launch in browser (default: false)
            open: true,

            // Show server address in console (default: true)
            verbose: false,
            //
            // // Folder to serve files from
            // contentBase: '',

            // Multiple folders to serve from
            // contentBase: ['dist', "test"],

            // Set to true to return index.html instead of 404
            historyApiFallback: false,

            // Options used in setting up server
            host: 'localhost',
            port: 8000
        }),


    ]
}