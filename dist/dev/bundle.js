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









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

var binl2rstr;
var binlMD5;
var bitRotateLeft;
var hexHMACMD5;
var hexMD5;
var md5;
var md5cmn;
var md5ff;
var md5gg;
var md5hh;
var md5ii;
var rawHMACMD5;
var rawMD5;
var rstr2binl;
var rstr2hex;
var rstrHMACMD5;
var rstrMD5;
var safeAdd;
var str2rstrUTF8;

safeAdd = function safeAdd(x, y) {
    var lsw, msw;
    lsw = (x & 0xFFFF) + (y & 0xFFFF);
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
};

bitRotateLeft = function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
};

md5cmn = function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
};

md5ff = function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
};

md5gg = function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
};

md5hh = function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
};

md5ii = function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
};

binlMD5 = function binlMD5(x, len) {

    /* append padding */
    var a, b, c, d, i, olda, oldb, oldc, oldd;
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    i = void 0;
    olda = void 0;
    oldb = void 0;
    oldc = void 0;
    oldd = void 0;
    a = 1732584193;
    b = -271733879;
    c = -1732584194;
    d = 271733878;
    i = 0;
    while (i < x.length) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
        i += 16;
    }
    return [a, b, c, d];
};

binl2rstr = function binl2rstr(input) {
    var i, length32, output;
    i = void 0;
    output = '';
    length32 = input.length * 32;
    i = 0;
    while (i < length32) {
        output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
        i += 8;
    }
    return output;
};

rstr2binl = function rstr2binl(input) {
    var i, length8, output;
    i = void 0;
    output = [];
    output[(input.length >> 2) - 1] = void 0;
    i = 0;
    while (i < output.length) {
        output[i] = 0;
        i += 1;
    }
    length8 = input.length * 8;
    i = 0;
    while (i < length8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
        i += 8;
    }
    return output;
};

rstrMD5 = function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
};

rstrHMACMD5 = function rstrHMACMD5(key, data) {
    var bkey, hash, i, ipad, opad;
    i = void 0;
    bkey = rstr2binl(key);
    ipad = [];
    opad = [];
    hash = void 0;
    ipad[15] = opad[15] = void 0;
    if (bkey.length > 16) {
        bkey = binlMD5(bkey, key.length * 8);
    }
    i = 0;
    while (i < 16) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
        i += 1;
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
};

rstr2hex = function rstr2hex(input) {
    var hexTab, i, output, x;
    hexTab = '0123456789abcdef';
    output = '';
    x = void 0;
    i = void 0;
    i = 0;
    while (i < input.length) {
        x = input.charCodeAt(i);
        output += hexTab.charAt(x >>> 4 & 0x0F) + hexTab.charAt(x & 0x0F);
        i += 1;
    }
    return output;
};

str2rstrUTF8 = function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
};

rawMD5 = function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s));
};

hexMD5 = function hexMD5(s) {
    return rstr2hex(rawMD5(s));
};

rawHMACMD5 = function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
};

hexHMACMD5 = function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d));
};

var index = md5 = function md5(string, key, raw) {
    if (!key) {
        if (!raw) {
            return hexMD5(string);
        }
        return rawMD5(string);
    }
    if (!raw) {
        return hexHMACMD5(key, string);
    }
    return rawHMACMD5(key, string);
};

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
    },
    unique: function unique(str) {

        return index(str);
    }
};

/**
 * Created by zhengqiguang on 2017/6/23.
 */

var VNode = function () {
    function VNode() {
        var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var type = arguments[1];
        classCallCheck(this, VNode);

        this.tagName = tagName;
        this.type = type;
        this.attrs = Object.create(null);
        this.children = [];

        this._innerHtml = null;
    }

    createClass(VNode, [{
        key: "appendChild",
        value: function appendChild(VDom) {
            this.children.push(VDom);
        }
    }, {
        key: "setAttribute",
        value: function setAttribute(k, v) {
            this.attrs[k] = v;
        }
    }, {
        key: "innerHtml",
        set: function set$$1(value) {
            this._innerHtml = value;
        },
        get: function get$$1() {
            return this._innerHtml;
        }
    }]);
    return VNode;
}();

/**
 * Created by zhengqiguang on 2017/6/23.
 */

var VDom = function (_VNode) {
    inherits(VDom, _VNode);

    function VDom(tagName) {
        classCallCheck(this, VDom);
        return possibleConstructorReturn(this, (VDom.__proto__ || Object.getPrototypeOf(VDom)).call(this, tagName, "tag"));
    }

    return VDom;
}(VNode);

/**
 * Created by zhengqiguang on 2017/6/23.
 */

var VText = function (_VNode) {
    inherits(VText, _VNode);

    function VText(content) {
        classCallCheck(this, VText);

        var _this = possibleConstructorReturn(this, (VText.__proto__ || Object.getPrototypeOf(VText)).call(this, null, "text"));

        _this.content = content;
        return _this;
    }

    return VText;
}(VNode);

/**
 * Created by zhengqiguang on 2017/6/23.
 */
var VDomFrag = function (_VNode) {
    inherits(VDomFrag, _VNode);

    function VDomFrag() {
        classCallCheck(this, VDomFrag);
        return possibleConstructorReturn(this, (VDomFrag.__proto__ || Object.getPrototypeOf(VDomFrag)).call(this, "", "frag"));
    }

    return VDomFrag;
}(VNode);

/**
 * Created by zhengqiguang on 2017/6/21.
 */
var compiler_helper = {
    VDom: VDom,
    VText: VText,
    VDomFrag: VDomFrag,

    _c: function _c(tagName) {
        var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


        var $t = new VDom(tagName);

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
                value: new VText("") //如果使用 documentFragment ,在插入页面之后无法获取其 parentNode,无法进行操作，因此写入一个空的 textNode
            };
        }
    },
    _f: function _f(data, itemName, keyName, renderEachFn) {

        var $t = new VDomFrag();

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
            value: new VText(temp)
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
 * Created by zhengqiguang on 2017/6/23.
 */

var v_dom_to_dom = {
    compiler: function compiler(vDom) {

        return this.walker(vDom);
    },
    walker: function walker(vDom) {
        if (vDom.type === "tag") {

            var $tag = document.createElement(vDom.tagName);
            vDom.$rDom = $tag;
            this.setAttr($tag, vDom.attrs);
            for (var i = 0, c; c = vDom.children[i]; i++) {
                $tag.appendChild(this.walker(c));
            }
            return $tag;
        } else if (vDom.type === "text") {

            var $txt = document.createTextNode(vDom.content);
            vDom.$rDom = $txt;
            return $txt;
        } else if (vDom.type === "frag") {

            var $frag = document.createDocumentFragment();
            vDom.$rDom = $frag;
            for (var _i = 0, _c; _c = vDom.children[_i]; _i++) {
                $frag.appendChild(this.walker(_c));
            }

            // vDom.$rDom = $frag.childNodes[0]; //将$rDom 赋值为 第一个 childNode,替换时才能够找到
            return $frag;
        }
    },
    setAttr: function setAttr($d, attrs) {
        for (var key in attrs) {
            $d.setAttribute(key, attrs[key]);
        }
    }
};

/**
 * Created by zhengqiguang on 2017/6/26.
 */
var handlerDiff = {
    do_diff: function do_diff($diffTree) {

        console.log($diffTree);
        this.walker($diffTree);
    },
    walker: function walker($diff) {
        if ($diff.diff.length) {
            var $r = true;

            for (var i = 0, d; d = $diff.diff[i]; i++) {

                if (d.diff.indexOf("tagName") !== -1 || d.diff.indexOf("content") !== -1) {
                    //标签被换掉了
                    $r = this.replaceNode(d.$oldDom, d.$dom);
                }

                if (d.diff.indexOf("remove") !== -1) {
                    //标签被删除了
                    $r = this.removedNode(d.$oldDom);
                }

                $r && this.walkerChildren(d.children);
            }
        } else {
            if ($diff.children && $diff.children.length) {
                this.walkerChildren($diff.children);
            }
        }
    },
    walkerChildren: function walkerChildren() {
        var $diffs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        for (var i = 0, $d; $d = $diffs[i]; i++) {
            this.walker($d);
        }
    },
    replaceNode: function replaceNode($oldDom, $dom) {
        if ($oldDom.type !== "frag") {
            $oldDom.$rDom.parentNode.replaceChild(v_dom_to_dom.compiler($dom), $oldDom.$rDom);
        } else {
            //针对 frag 做特殊处理
            this.replaceNode($oldDom.children[0], $dom);
            for (var i = 1, c; c = $oldDom.children[i]; i++) {
                this.removedNode(c);
            }
        }
        return false;
    },
    removedNode: function removedNode($dom) {
        $dom.$rDom.parentNode.removeChild($dom.$rDom);
        return false;
    }
};

/**
 * Created by zhengqiguang on 2017/6/23.
 */

var diff = {
    d_o: function d_o($oldDom, $dom) {

        var $diffTree = {};

        this.walker($oldDom.value, $dom.value, $diffTree);

        handlerDiff.do_diff($diffTree);
    },
    walker: function walker($oldDom, $dom, $diffTree) {

        $diffTree.$oldDom = $oldDom;
        $diffTree.$dom = $dom;

        var $d = this.doDiff($oldDom, $dom);
        $diffTree.diff = [];

        if ($d.diff.length) {
            $diffTree.diff.push($d);
        }

        if ($d.diff.indexOf("tagName") == -1) {
            //如果 tag 不同，则直接整个元素替换
            var l = Math.max($oldDom && $oldDom.children.length || 0, $dom && $dom.children.length || 0);
            $diffTree.children = [];
            for (var i = 0; i < l; i++) {
                var $ct = {};
                $diffTree.children.push($ct);
                this.walker($oldDom && $oldDom.children[i], $dom && $dom.children[i], $ct);
            }
        }
    },
    doDiff: function doDiff($oldDom, $dom) {

        var d = {
            diff: [],
            $oldDom: $oldDom,
            $dom: $dom
        };

        if (!$oldDom) {
            d.diff.push("add");
            // console.warn("add diff");
        }

        if (!$dom) {
            d.diff.push("remove");
            // console.warn("remove diff");
        }

        if (!$oldDom || !$dom) {
            return d;
        }

        if ($oldDom.tagName !== $dom.tagName || $oldDom.type !== $dom.type) {
            //如果是 tagName 不同或者是 type 不同
            d.diff.push("tagName"
            // console.warn("tagName or type diff");
            );
        }

        if (JSON.stringify($oldDom.attrs) !== JSON.stringify($dom.attrs)) {

            d.diff.push("attrs"
            // console.warn("attrs diff");
            );
        }

        if ($oldDom.content !== $dom.content) {
            d.diff.push("content"
            // console.warn("content diff", $oldDom, $dom);
            );
        }

        if ($oldDom.innerHtml !== $dom.innerHtml) {
            d.diff.push("innerHTML"
            // console.warn("innerHtml diff");
            );
        }

        return d;
    }
};

/**
 * Created by zhengqiguang on 2017/6/15.
 */

var render = {
    mount: function mount($node, $data) {

        compiler_helper.data = $data;

        var $vdom = $node.$tplfn(compiler_helper);

        if (!$node.$vDom) {
            //还没有 vdom，说明是初始化

            var $d = v_dom_to_dom.compiler($vdom.value);
            $node.$vDom = $vdom;
            this.replaceNode($d, $node);
        } else {

            diff.d_o($node.$vDom, $vdom);

            $node.$vDom = $vdom;
        }
        //
        //
        // let $newDom = this.generalDom($node.$tplfn(compiler_helper));
        //
        // this.replaceNode($newDom, $node);
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
        this.$vDom = null;
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
                            // 深度监听

                            this.mountWatcher($data[key], od[key]["_od_"]);
                        } else if (type === "Array") {
                            this.hookArray($data[key], od[key]);
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
        key: "hookArray",
        value: function hookArray($d, $o) {

            ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {

                (function ($arr, $od) {
                    $arr[method] = function () {
                        Array.prototype[method].apply($arr, arguments);
                        $od.value = $arr;

                        var $n = $od.linkNodes;
                        for (var i = 0, n; n = $n[i]; i++) {
                            n.update();
                        }
                    };

                    Object.defineProperty($arr, method, {
                        enumerable: false
                    });
                })($d, $o);
            });
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
