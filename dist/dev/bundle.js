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

var dslMap = {
    "dsl-if": 1,
    "dsl-for": 1,
    "dsl-html": 1
};

var DSL = function () {
    function DSL() {
        classCallCheck(this, DSL);

        this.initAll();
    }

    createClass(DSL, [{
        key: "initAll",
        value: function initAll() {}
    }, {
        key: "dslMap",
        get: function get$$1() {
            return dslMap;
        }
    }]);
    return DSL;
}();

var dsl = new DSL();

var attrRE = /([:\w-]+)|['"]{1}([^'"]*)['"]{1}/g;

// create optimized lookup object for
// void elements as listed here:
// http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements

var lookup = Object.create ? Object.create(null) : {};
lookup.area = true;
lookup.base = true;
lookup.br = true;
lookup.col = true;
lookup.embed = true;
lookup.hr = true;
lookup.img = true;
lookup.input = true;
lookup.keygen = true;
lookup.link = true;
lookup.menuitem = true;
lookup.meta = true;
lookup.param = true;
lookup.source = true;
lookup.track = true;
lookup.wbr = true;

var parseTag = function (tag) {
    var i = 0;
    var key;
    var res = {
        type: 'tag',
        name: '',
        voidElement: false,
        attrs: {},
        children: [],
        dsl: []
    };

    tag.replace(attrRE, function (match) {

        if (dsl.dslMap[match]) {
            res.dsl.push(match);
        }

        if (i % 2) {
            key = match;
        } else {
            if (i === 0) {
                if (lookup[match] || tag.charAt(tag.length - 2) === '/') {
                    res.voidElement = true;
                }
                res.name = match;
            } else {
                res.attrs[key] = match.replace(/['"]/g, '');
            }
        }
        i++;
    });

    return res;
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */
var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

var empty = Object.create ? Object.create(null) : {};

var htmlParse = function (html, options) {
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;

    html.replace(tagRE, function (tag, index) {
        if (inComponent) {
            if (tag !== '</' + current.name + '>') {
                return;
            } else {
                inComponent = false;
            }
        }
        var isOpen = tag.charAt(1) !== '/';
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;

        if (isOpen) {
            level++;

            current = parseTag(tag);
            if (current.type === 'tag' && options.components[current.name]) {
                current.type = 'component';
                inComponent = true;
            }

            if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
                current.children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start)),
                    parent: current
                });
            }

            byTag[current.tagName] = current;

            // if we're at root, push new base node
            if (level === 0) {
                result.push(current);
            }

            parent = arr[level - 1];

            if (parent) {
                current.prev = parent.children[parent.children.length - 1];
                parent.children[parent.children.length - 1].next = current;
                parent.children.push(current);
                current.parent = parent;
            }

            arr[level] = current;
        }

        if (!isOpen || current.voidElement) {
            level--;
            if (!inComponent && nextChar !== '<' && nextChar) {
                // trailing text node
                arr[level].children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start)),
                    parent: arr[level]
                });
            }
        }
    });

    return result;
};

/**
 * Created by zhengqiguang on 2017/6/15.
 * 修改 by  https://github.com/HenrikJoreteg/html-parse-stringify/
 */

/**
 * Created by zhengqiguang on 2017/6/21.
 */

var compiler_helper = {
    _c: function _c(tagName) {
        var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


        var $t = document.createElement(tagName);

        for (var key in attrs) {
            $t.setAttribute(key, attrs[key]);
        }

        for (var i = 0, n; n = children[i]; i++) {
            $t.appendChild(n.value);
        }

        return {
            type: "tag",
            value: $t
        };
    },
    getItemData: function getItemData(data, itemNameSet) {

        if (itemNameSet.length == 1) {
            return data[itemNameSet[0]];
        } else {
            return this.getItemData(data[itemNameSet.shift()], itemNameSet);
        }
    },
    _i: function _i(data, itemName, renderIfFn) {

        if (this.getItemData(data, itemName)) {
            return renderIfFn();
        } else {
            return {
                type: "fragment",
                value: document.createDocumentFragment()
            };
        }
    },
    _f: function _f(data, itemName, keyName, renderEachFn) {

        var $t = document.createDocumentFragment();

        var $o = this.getItemData(data, itemName);

        for (var item in $o) {
            data[keyName] = $o[item];

            $t.appendChild(renderEachFn(data).value);
        }

        delete data[keyName];

        return {
            type: "fragment",
            value: $t
        };
    },
    _h: function _h(data, htmlItemName, tagName) {
        var attrs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


        var $t = this._c(tagName, attrs).value;
        $t.innerHTML = this.getItemData(data, htmlItemName);
        return {
            type: "tag",
            value: $t
        };
    },
    _t: function _t(fn, data) {

        var temp = fn(data);

        return {
            type: "text",
            value: document.createTextNode(temp)
        };
    },
    generaltplFn: function generaltplFn($ast) {

        var linkArgs = [];
        var $temp = this.generalNode($ast, linkArgs),
            $tempFn = "with(that){return " + $temp + "}";
        var tplFn = new Function("that", "" + $tempFn);

        return {
            tplFn: tplFn,
            linkArgs: linkArgs
        };
    },
    generalNode: function generalNode($node, linkArgs) {
        var _this = this;

        if ($node.dsl && $node.dsl.length) {
            //存在 dsl
            //dsl 优先级 if > for > html
            var $sdlTemp = "";
            var dslIndex = void 0;
            if ((dslIndex = $node.dsl.indexOf("dsl-if")) !== -1) {
                //先判断 if 语句
                var itemName = $node.attrs["dsl-if"]; //现在只判断了值，没有进行表达式判断

                linkArgs.push(itemName);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-if"];

                return "_i(data," + this.formatParam(itemName) + ",function(){\n                    return " + this.generalNode($node, linkArgs) + " \n                })";
            } else if ((dslIndex = $node.dsl.indexOf("dsl-for")) !== -1) {
                //
                var reg = /([\w\W]+) in ([\w\W]+)/,
                    result = $node.attrs["dsl-for"].match(reg);

                linkArgs.push(result[2]);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-for"];

                return "_f(data," + this.formatParam(result[2]) + ",'" + result[1] + "',function(data){\n                    return " + this.generalNode($node, linkArgs) + " ;\n                })";
            } else if ((dslIndex = $node.dsl.indexOf("dsl-html")) !== -1) {
                //有 html 模板的时候，忽略其中的节点，因为会被替换
                var _itemName = $node.attrs["dsl-html"]; //现在只判断了值，没有进行表达式判断

                linkArgs.push(_itemName);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-html"];

                return "_h(data," + this.formatParam(_itemName) + ",'" + $node.name + "', " + JSON.stringify($node.attrs) + ")";
            }
        } else if ($node.type === "tag") {
            return "_c('" + $node.name + "', " + JSON.stringify($node.attrs) + ",[" + $node.children.map(function (item) {
                return _this.generalNode(item, linkArgs);
            }) + "])";
        } else if ($node.type === "text") {
            $node.content = $node.content.replace(/\n/g, "");
            var text = $node.content.trim();

            var patt = /{{[ \t]*([\w\W]*?)[ \t]*}}/g;

            var _result = "",
                temp = "",
                cursor = 0;

            while ((_result = patt.exec(text)) !== null) {
                var $temp1 = text.slice(cursor, _result.index); //模板前面
                cursor += $temp1.length;

                temp += this.wrapStaticBlock($temp1);

                temp += this.wrapDynamicBlock(_result);

                linkArgs.push(_result[1]);

                cursor += _result[0].length;
            }

            temp += this.wrapStaticBlock(text.slice(cursor, text.length));

            var fn = this.gTplFn(temp);

            return "_t(" + fn.toString() + ",data)";
        }
    },
    wrapStaticBlock: function wrapStaticBlock(str) {

        return "\'" + str + "\'";
    },
    wrapDynamicBlock: function wrapDynamicBlock(result) {

        return " + data." + result[1] + " + ";
    },

    gTplFn: function gTplFn(str) {

        var $t = " return " + str;

        $t = $t.replace(/\n/g, "");

        var $tempFn = new Function("data", $t);

        return $tempFn;
    },
    formatParam: function formatParam(str) {
        var $s = str.split(".");
        return JSON.stringify($s);
    }
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var render = {
    mount: function mount($node, $data) {

        compiler_helper.data = $data;

        var $newDom = this.generalDom($node.$tplfn(compiler_helper));

        this.replaceNode($newDom, $node);
    },
    generalDom: function generalDom(domStr) {

        if (domStr instanceof Object) {
            return domStr.value;
        }

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

var Compiler = function () {
    function Compiler(tpl) {
        classCallCheck(this, Compiler);

        this.$tpl = render.generalDom(tpl);
        this.tpl = this.$tpl.outerHTML;
        this.$ast = htmlParse(tpl);

        this.init(compiler_helper.generaltplFn(this.$ast[0]));
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

var typeReg = /\[object ([\w\W]+?)\]/;

var gettype = Object.prototype.toString;

var common = {
    checkType: function checkType(thing) {
        return gettype.call(thing).match(typeReg)[1];
    },
    formatParam: function formatParam(str) {
        var $s = str.split(".");
        return JSON.stringify($s);
    },
    getItemData: function getItemData(data, itemNameSet) {

        if (itemNameSet.length == 1) {
            if (!data) {
                return void 0;
            }
            return data[itemNameSet[0]];
        } else {
            return this.getItemData(data[itemNameSet.shift()], itemNameSet);
        }
    },
    getOdItemData: function getOdItemData(data, itemNameSet) {
        if (itemNameSet.length == 1) {
            if (!data) {
                return void 0;
            }
            return data[itemNameSet[0]];
        } else {
            return this.getOdItemData(data[itemNameSet.shift()]["_od_"], itemNameSet);
        }
    }
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */
var Watcher = function () {
    function Watcher(data) {
        classCallCheck(this, Watcher);

        this.$data = data;
        this.mountWatcher(this.$data, this.$data["_od_"]);
    }

    createClass(Watcher, [{
        key: "mountWatcher",
        value: function mountWatcher($data, od) {

            for (var key in $data) {

                (function (key) {

                    var type = common.checkType($data[key]);

                    var timeoutHandler = null;

                    if (key !== "_od_" && !od[key].mounted) {
                        if (!od[key]) {
                            throw new Error("data:" + key + " is init ");
                        }
                        Object.defineProperty($data, key, {
                            get: function get$$1() {
                                return od[key].value;
                            },
                            set: function set$$1(value) {
                                console.log(123123123);

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
                        if (type === "Object") {
                            this.mountWatcher($data[key], od[key]["_od_"]);
                        }
                    }
                }).bind(this)(key);
            }
        }
    }, {
        key: "linkNode",
        value: function linkNode($node) {

            for (var i = 0, n; n = $node.$args[i]; i++) {

                var $s = common.formatParam(n);

                var $c = common.getItemData(this.$data, JSON.parse($s));

                var $d = common.getOdItemData(this.$data["_od_"], JSON.parse($s));

                if ($c !== undefined && $d !== undefined && $d.linkNodes.indexOf($node) === -1) {

                    $d.linkNodes.push($node);
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
            var type = common.checkType($data[key]);

            if (type === "Object") {
                var $tempTargetData = {};
                this.insertOD($tempTargetData, $data[key]);
                $targetData[key] = {
                    value: $data[key],
                    linkNodes: [],
                    mounted: false,
                    _od_: $tempTargetData
                };
            } else {

                $targetData[key] = {
                    value: $data[key],
                    linkNodes: [],
                    mounted: false
                };
            }
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
