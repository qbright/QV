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

        this.init(compiler_helper.generaltplFn(this.$ast[0]));

    }


    init({tplFn, linkArgs}) {
        this.tplFn = tplFn;
        this.linkArgs = linkArgs;
    }

}


export default Compiler;
