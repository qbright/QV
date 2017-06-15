/**
 * Created by zhengqiguang on 2017/6/14.
 */


let rollup = require("rollup");
let rollupPluginBabel = require("rollup-plugin-babel");
let fs = require("fs");

let cache;

let server = require("rollup-plugin-serve");

rollup.rollup({
    entry: "./src/index.js",
    plugins: [
        rollupPluginBabel({
            exclude: 'node_modules/**'
        }),

    ]


}).then(bundle => {
    var result = bundle.generate({
        // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
        format: 'umd',
        moduleName:"QV"
    });

    // Cache our bundle for later use (optional)
    cache = bundle;

    fs.writeFileSync('./bundle.js', result.code);

    // Alternatively, let Rollup do it for you
    // (this returns a promise). This is much
    // easier if you're generating a sourcemap
    // bundle.write({
    //     format: 'cjs',
    //     dest: 'bundle.js'
    // });

});