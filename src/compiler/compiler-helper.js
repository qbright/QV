/**
 * Created by zhengqiguang on 2017/6/21.
 */
import common from "../common/common";


import VDom from "../v-dom/VDom";
import VText from "../v-dom/VText";
import VDomFrag from "../v-dom/VDomFrag";


const compiler_helper = {
    VDom: VDom,
    VText: VText,
    VDomFrag: VDomFrag,

    _c(tagName, attrs = {}, children = []){

        let $t = new VDom(tagName);

        for (let key in attrs) {
            $t.setAttribute(key, attrs[key]);
        }


        for (let i = 0, n; n = children[i]; i++) {
            n.parentNode = $t;
            $t.appendChild(n.value);
        }


        return {
            type: "tag",
            value: $t
        };
    },
    getItemData(data, itemNameSet){

        if (itemNameSet.length == 1) {
            return data[itemNameSet[0]];
        } else {
            return this.getItemData(data[itemNameSet.shift()], itemNameSet);
        }

    },
    _i(data, itemName, renderIfFn){

        if (this.getItemData(data, itemName)) {
            return renderIfFn();
        } else {
            return {
                type: "fragment",
                value: new VText("") //如果使用 documentFragment ,在插入页面之后无法获取其 parentNode,无法进行操作，因此写入一个空的 textNode
            }
        }
    },
    _f(data, itemName, keyName, renderEachFn){

        let $t = new VDomFrag();

        let $o = this.getItemData(data, itemName);

        for (let item in $o) {
            data[keyName] = $o[item];


            $t.appendChild(renderEachFn(data, $t).value);
        }

        delete data[keyName];

        return {
            type: "fragment",
            value: $t
        };

    },

    _h(data, htmlItemName, tagName, attrs = {}){

        let $t = this._c(tagName, attrs).value;
        $t.innerHTML = this.getItemData(data, htmlItemName);
        return {
            type: "tag",
            value: $t
        }

    },

    _t(fn, data){

        let temp = fn(data);

        return {
            type: "text",
            value: new VText(temp)
        };
    },

    generaltplFn($ast){

        let linkArgs = [];
        let $temp = this.generalNode($ast, linkArgs),

            $tempFn = `with(that){return ${$temp}}`;
        let tplFn = new Function("that", `${$tempFn}`);

        return {
            tplFn: tplFn,
            linkArgs: linkArgs
        };

    },
    generalNode($node, linkArgs){

        if ($node.dsl && $node.dsl.length) { //存在 dsl
            //dsl 优先级 if > for > html
            let $sdlTemp = "";
            let dslIndex;
            if ((dslIndex = $node.dsl.indexOf("dsl-if")) !== -1) { //先判断 if 语句
                let itemName = $node.attrs["dsl-if"];//现在只判断了值，没有进行表达式判断

                linkArgs.push(itemName);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-if"];


                return `_i(data,${this.formatParam(itemName)},function(){
                    return ${this.generalNode($node, linkArgs)} 
                })`


            } else if ((dslIndex = $node.dsl.indexOf("dsl-for")) !== -1) { //
                let reg = /([\w\W]+) in ([\w\W]+)/,
                    result = $node.attrs["dsl-for"].match(reg);


                linkArgs.push(result[2]);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-for"];

                return `_f(data,${this.formatParam(result[2])},'${result[1]}',function(data){
                    return ${this.generalNode($node, linkArgs)} ;
                })`

            } else if ((dslIndex = $node.dsl.indexOf("dsl-html")) !== -1) {
                //有 html 模板的时候，忽略其中的节点，因为会被替换
                let itemName = $node.attrs["dsl-html"];//现在只判断了值，没有进行表达式判断

                linkArgs.push(itemName);

                $node.dsl.splice(dslIndex, 1);
                delete $node.attrs["dsl-html"];

                return `_h(data,${this.formatParam(itemName)},'${$node.name}', ${JSON.stringify($node.attrs)})`;


            }


        } else if ($node.type === "tag") {
            return `_c('${$node.name}', ${JSON.stringify($node.attrs)},[${$node.children.map(item => {
                return this.generalNode(item, linkArgs)
            })}])`

        } else if ($node.type === "text") {
            $node.content = $node.content.replace(/\n/g, "");
            let text = $node.content.trim();

            let patt = /{{[ \t]*([\w\W]*?)[ \t]*}}/g;

            let result = "",
                temp = "",
                cursor = 0;

            while ((result = patt.exec(text)) !== null) {
                let $temp1 = text.slice(cursor, result.index); //模板前面
                cursor += $temp1.length;

                temp += this.wrapStaticBlock($temp1);

                temp += this.wrapDynamicBlock(result);

                linkArgs.push(result[1]);

                cursor += result[0].length;
            }


            temp += this.wrapStaticBlock(text.slice(cursor, text.length));

            let fn = this.gTplFn(temp);

            return `_t(${fn.toString()},data)`
        }


    },
    wrapStaticBlock(str) {

        return "\'" + str + "\'";

    },
    wrapDynamicBlock (result) {

        return " + data." + result[1] + " + "
    },
    gTplFn: function (str) {

        let $t = " return " + str;

        $t = $t.replace(/\n/g, "");

        let $tempFn = new Function("data", $t);

        return $tempFn;

    },
    formatParam(str){
        let $s = str.split(".");
        return JSON.stringify($s);
    }

}

export default compiler_helper;
