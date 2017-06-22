'use strict';

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

safeAdd = function (x, y) {
    var lsw, msw;
    lsw = (x & 0xFFFF) + (y & 0xFFFF);
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
};

bitRotateLeft = function (num, cnt) {
    return num << cnt | num >>> 32 - cnt;
};

md5cmn = function (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
};

md5ff = function (a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
};

md5gg = function (a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
};

md5hh = function (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
};

md5ii = function (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
};

binlMD5 = function (x, len) {

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

binl2rstr = function (input) {
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

rstr2binl = function (input) {
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

rstrMD5 = function (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
};

rstrHMACMD5 = function (key, data) {
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

rstr2hex = function (input) {
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

str2rstrUTF8 = function (input) {
    return unescape(encodeURIComponent(input));
};

rawMD5 = function (s) {
    return rstrMD5(str2rstrUTF8(s));
};

hexMD5 = function (s) {
    return rstr2hex(rawMD5(s));
};

rawHMACMD5 = function (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
};

hexHMACMD5 = function (k, d) {
    return rstr2hex(rawHMACMD5(k, d));
};

var index = md5 = function (string, key, raw) {
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

export default index;
