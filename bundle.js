(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.QV = factory());
}(this, (function () { 'use strict';

/**
 * Created by zhengqiguang on 2017/6/14.
 */

var t = {
    aa: function aa() {
        console.log("aa");
    }
};

/**
 * Created by zhengqiguang on 2017/6/14.
 */

t.aa();

console.log("index");
var k = {};

return k;

})));
