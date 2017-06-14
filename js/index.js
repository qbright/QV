/**
 * Created by zhengqiguang on 2017/6/13.
 */


(function (window) {


    /**
     * QV
     * @param option
     * @constructor
     */
    var QV = function (option) {
        this.init(option);
    }


    initMinix(QV);


    function initMinix(QV) {

        QV.prototype.init = function (opt) {

            this.el = opt.el;

            this.template = this.template;

            this.$data = opt.data || {};

            this.$data["_od_"] = insertOD(this.$data["_od_"], this.$data);

            this.mountWatcher();

            this.vnode = new QNODE(opt, this.$data);

            this.mount(this.vnode);

        }

        QV.prototype.mount = function (vnode) {
            vnode.$el.parentNode.replaceChild(vnode.$dom, vnode.$el);

            // vnode.$dom = vnode.$el;
        }

        QV.prototype.mountWatcher = function () {

            for (var key in this.$data) {

                if (key !== "_od_") {
                    (function (key) {
                        Object.defineProperty(this.$data, key, {
                            get: function () {
                                return this.$data["_od_"][key].value;
                            }.bind(this),
                            set: function (value) {
                                if (value !== this.$data["_od_"][key].value) {
                                    console.log(123);

                                    var $n = this.$data["_od_"][key].linkNodes;

                                    this.$data["_od_"][key].value = value;

                                    for (var i = 0, n; n = $n[i]; i++) {
                                        n.update();
                                    }


                                }
                            }.bind(this)
                        });

                    }.bind(this))(key);

                }


            }


        }

    }

    function insertOD($targetData, $data) {

        !$targetData && ($targetData = {});

        for (var key in $data) {
            $targetData[key] = {
                value: $data[key],
                linkNodes: []
            }
        }

        return $targetData;
    }


    /**
     * QNODE
     * @param opt
     * @constructor
     */
    function QNODE(opt, $data) {
        this.el = opt.el;
        this.template = opt.template;
        this.opt = opt;

        this.$data = $data;

        this.$el = document.querySelector(this.el);

        this.$template = document.querySelector(this.template).innerHTML;

        this.$html = this.$template;

        this.init();

    }

    initQNODE(QNODE);

    function initQNODE(QNODE) {
        QNODE.prototype.init = function () {
            this.generalTplFn(); //生成模板函数

            this.linkWatcher();

            this.renderNode();//数据和模板结合生成 html

            this.generalDom();
        }


        QNODE.prototype.generalTplFn = function () {
            var $t = template.generalTemplateFn(this.$template);

            this.renderFn = $t.tplFn;
            this.linkArgs = $t.linkArgs;

        }

        QNODE.prototype.linkWatcher = function () {

            for (var i = 0, t; t = this.linkArgs[i]; i++) {
                this.$data["_od_"][t].linkNodes.push(this);
            }
        }

        QNODE.prototype.generalDom = function (isReturn) {

            var $dom = tplToDom(this.$html); //这里只能使用有唯一父节点的模板
            if ($dom.length !== 1) {
                throw new Error("只能存在唯一的父亲节点");
            } else {
                if (isReturn) {
                    return $dom[0];
                } else {
                    this.$dom = $dom[0];
                }
            }
        }

        QNODE.prototype.renderNode = function () {
            // console.log(this.$data);
            this.$html = this.renderFn(this.$data);

            // console.log(this.renderFn);
            console.log(this.$html);
        }

        QNODE.prototype.update = function () {
            this.renderNode();
            var $oldDom = this.$dom;
            var $newDom = this.generalDom(true);
            $oldDom.parentNode.replaceChild($newDom, $oldDom);
            this.$dom = $newDom;
        }
    }

    function tplToDom(tpl) {
        var $temp = document.createElement("div");
        $temp.innerHTML = tpl.trim(); //不然会有多余的空格等东西
        return $temp.childNodes;

    }

    var template = {
        generalTemplateFn: function (tpl) {
            var patt = new RegExp("\{\{\[ \\t\]\*\(\[\@\#\]\?\)\(\\\/\?\)\(\[\\w\\W\]\*\?\)\[ \\t\]\*\}\}", "g");
            var result;


            // console.log(patt, tpl);
            // console.log(patt.exec(tpl));
            var $tempStrFn = "";
            var fnArgs = [];
            var cursor = 0;
            while ((result = patt.exec(tpl)) != null) {
                var $temp1 = tpl.slice(cursor, result.index); //标志符之前的静态

                cursor += $temp1.length;

                $tempStrFn += this.wrapStaticBlock($temp1);

                var $temp2 = tpl.slice(cursor, cursor + result[0].length); //获取标志

                fnArgs.push(result[3]);
                $tempStrFn += this.wrapDynamicBlock(result);

                cursor = cursor + result[0].length;
            }

            var $tempLast = tpl.slice(cursor, tpl.length); //获取闭合的元素

            $tempStrFn += this.wrapStaticBlock($tempLast);

            var tplFn = this.gTplFn($tempStrFn);

            return {tplFn: tplFn, linkArgs: fnArgs};

        },

        wrapStaticBlock: function (str) {

            return "\'" + str + "\'";

        },
        wrapDynamicBlock: function (result) {

            return " + od." + result[3] + " + "
        },
        gTplFn: function (str) {

            var $t = "console.log(od); return " + str;

            $t = $t.replace(/\n/g, "");

            var $tempFn = new Function("od", $t);

            return $tempFn;

        }


    }


    window.QV = QV;

})(window);
