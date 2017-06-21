(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.QV = factory());
}(this, (function () { 'use strict';

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var selector = {
    s: function s() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        //单个
        return document.querySelector(selector);
    },
    m: function m() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        // 集合
        return document.querySelectorAll(selector);
    },
    id: function id() {
        var _id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        return document.getElementById(_id);
    }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var compiler_helper = {
    generaltplFn: function generaltplFn(tpl) {

        var patt = /{{[ \t]*([\w\W]*?)[ \t]*}}/g,
            result = void 0;

        var tempStrFn = "",
            fnArgs = [],
            cursor = 0;

        while ((result = patt.exec(tpl)) !== null) {

            console.log(result);

            var $temp1 = tpl.slice(cursor, result.index);
            cursor += $temp1.length;

            tempStrFn += this.wrapStaticBlock($temp1);

            // let $temp2 = tpl.slice(cursor, cursor + result[0].length);

            fnArgs.push(result[1]);
            tempStrFn += this.wrapDynamicBlock(result);
            cursor += result[0].length;
        }

        var tempLast = tpl.slice(cursor, tpl.length);

        tempStrFn += this.wrapStaticBlock(tempLast);

        var tplFn = this.gTplFn(tempStrFn);

        return {
            tplFn: tplFn,
            linkArgs: fnArgs
        };
    },

    wrapStaticBlock: function wrapStaticBlock(str) {

        return "\'" + str + "\'";
    },
    wrapDynamicBlock: function wrapDynamicBlock(result) {

        return " + od." + result[1] + " + ";
    },
    gTplFn: function gTplFn(str) {

        var $t = "return " + str;

        $t = $t.replace(/\n/g, "");

        var $tempFn = new Function("od", $t);

        return $tempFn;
    }

};

var Compiler = function () {
    function Compiler(tpl) {
        classCallCheck(this, Compiler);

        this.tpl = tpl;
        this.init(compiler_helper.generaltplFn(this.tpl));
    }

    createClass(Compiler, [{
        key: "init",
        value: function init(_ref) {
            var tplFn = _ref.tplFn,
                linkArgs = _ref.linkArgs;

            this.tplFn = tplFn;
            this.linkArgs = linkArgs;
        }
    }]);
    return Compiler;
}();

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var render = {
    mount: function mount($node, $data) {

        var $newDom = this.generalDom($node.$tplfn($data));

        this.replaceNode($newDom, $node);
    },
    generalDom: function generalDom(domStr) {
        var $temp = document.createElement("div");
        $temp.innerHTML = domStr.trim(); //不然会有多余的空格等东西
        return $temp.childNodes[0];
    },
    replaceNode: function replaceNode(newDom, node) {
        var $el = node.$el;

        $el.parentNode.replaceChild(newDom, $el);

        node.$el = newDom;
    }
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var EventLoop = {
    d_o: function d_o(fn) {
        var p = Promise.resolve();
        p.then(fn).catch(function (e) {
            console.log(e);
        });
    }
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var Node = function () {
    function Node(_ref) {
        var el = _ref.el,
            template = _ref.template,
            data = _ref.data;
        classCallCheck(this, Node);

        this.$data = data;
        this.el = el;
        this.template = template;
        this.$el = selector.s(this.el);

        var $t = selector.s(this.template);
        if ($t) {
            this.$template = $t.innerHTML.trim();
        } else {
            //error
        }
        this.$compiler = new Compiler(this.$template);

        this.$args = this.$compiler.linkArgs;
        this.$tplfn = this.$compiler.tplFn;
    }

    createClass(Node, [{
        key: "update",
        value: function update() {
            EventLoop.d_o(render.mount.bind(render, this, this.$data));
        }
    }]);
    return Node;
}();

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var Watcher = function () {
    function Watcher(data) {
        classCallCheck(this, Watcher);

        this.$data = data;
        this.mountWatcher();
    }

    createClass(Watcher, [{
        key: "mountWatcher",
        value: function mountWatcher() {

            var od = this.$data["_od_"];

            for (var key in this.$data) {

                (function (key) {

                    var timeoutHandler = null;

                    if (key !== "_od_" && !od[key].mounted) {
                        if (!od[key]) {
                            throw new Error("data:" + key + " is init ");
                        }
                        Object.defineProperty(this.$data, key, {
                            get: function get$$1() {
                                return od[key].value;
                            },
                            set: function set$$1(value) {
                                clearTimeout(timeoutHandler);
                                setTimeout(function () {
                                    if (value !== od[key].value) {
                                        var $n = od[key].linkNodes;
                                        od[key].value = value;
                                        for (var i = 0, n; n = $n[i]; i++) {
                                            n.update();
                                        }
                                    }
                                }, 1000 / 60); //一帧节流
                            }
                        });
                        od[key].mounted = true;
                    }
                }).bind(this)(key);
            }
        }
    }, {
        key: "linkNode",
        value: function linkNode($node) {

            for (var i = 0, n; n = $node.$args[i]; i++) {
                if (this.$data[n] && this.$data["_od_"][n] && this.$data["_od_"][n].linkNodes.indexOf($node) === -1) {
                    this.$data["_od_"][n].linkNodes.push($node);
                }
            }
        }
    }, {
        key: "updateData",
        value: function updateData() {}
    }]);
    return Watcher;
}();

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var helper = {
    insertOD: function insertOD($targetData, $data) {

        !$targetData && ($targetData = {});

        for (var key in $data) {
            $targetData[key] = {
                value: $data[key],
                linkNodes: [],
                mounted: false
            };
        }
        return $targetData;
    }
};

var Data = function () {
    function Data() {
        classCallCheck(this, Data);
    }

    createClass(Data, null, [{
        key: "formatData",
        value: function formatData() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            data["_od_"] = helper.insertOD(data["_od_"], data);
            return data;
        }
    }]);
    return Data;
}();

/**
 * Created by zhengqiguang on 2017/6/14.
 */

var QV = function () {
    function QV() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, QV);

        this._$opt = opt;

        this.formatOption(opt);

        this.mountRoot();
    }

    createClass(QV, [{
        key: "formatOption",
        value: function formatOption(opt) {

            this.$data = Data.formatData(opt.data);

            this.$root = new Node(opt);

            this.$watcher = new Watcher(this.$data);

            this.$watcher.linkNode(this.$root);
        }
    }, {
        key: "mountRoot",
        value: function mountRoot() {
            render.mount(this.$root, this.$data);
        }
    }]);
    return QV;
}();

/**
 * Created by zhengqiguang on 2017/6/14.
 */

return QV;

})));
//# sourceMappingURL=bundle.js.map
