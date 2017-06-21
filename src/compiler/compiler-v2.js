/**
 * Created by zhengqiguang on 2017/6/15.
 */


import {parse as htmlParse, stringify as htmlStringify} from "./ast/index";

import Render from "../core/render";

import compiler_helper from "./compiler-helper";

class Compiler {


    constructor(tpl) {
        this.$tpl = Render.generalDom(tpl);
        this.tpl = this.$tpl.outerHTML;
        this.$ast = htmlParse(tpl);

        // console.log(this.$ast[0]);

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
