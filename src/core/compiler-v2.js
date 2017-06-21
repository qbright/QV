/**
 * Created by zhengqiguang on 2017/6/15.
 */


import {parse as htmlParse, stringify as htmlStringify} from "../compiler/ast/index";

import Render from "./render";


const compiler_helper = {
    _c(tagName, attrs, children = [], data){

        console.log(data);

    },
    _t(text, data){


        console.log(text, data);

    },
    //
    // generaltplFn(){
    //
    //     let a = new Function("that", "with(that){; return _tt()}");
    //
    //     a(this);
    //
    //
    // },

    generaltplFn($ast){

        let $tempFn = this.generalNode($ast);


        $tempFn = `with(that){return ${$tempFn}}`;

        console.log($tempFn);

        let a = new Function("that", "data", `${$tempFn}`);

        console.log(a(this, {a: 1, sdf: "hello", ccc: "nimei"}));

        return {};

    },
    generalNode($node){

        if ($node.dsl && $node.dsl.length) { //存在 dsl

        } else if ($node.type === "tag") {
            return `_c('${$node.name}', ${JSON.stringify($node.attrs)},[${$node.children.map(item => {
                return this.generalNode(item)
            })}],data)`

        } else if ($node.type === "text") {
            $node.content = $node.content.replace(/\n/g, "");

            return `_t('${$node.content.trim()}',data)`
        }


    }


}


class Compiler {


    constructor(tpl) {
        this.$tpl = Render.generalDom(tpl);
        this.tpl = this.$tpl.outerHTML;
        this.$ast = htmlParse(tpl);

        compiler_helper.generaltplFn(this.$ast[0]);


        // console.log(htmlStringify(this.$ast));

        // this.init(compiler_helper.generaltplFn(this.tpl));

    }


    init({tplFn, linkArgs}) {
        this.tplFn = tplFn;
        this.linkArgs = linkArgs;
    }

    rebuild() {


    }

}


export default Compiler;
