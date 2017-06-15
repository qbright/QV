/**
 * Created by zhengqiguang on 2017/6/15.
 */

import selector from  "../common/selector";

import Compiler from "./compiler"

import Render  from "./render";

import EventLoop from "./event-loop";

class Node {

    constructor({el, template, data}) {
        this.$data = data;
        this.el = el;
        this.template = template;
        this.$el = selector.s(this.el);

        let $t = selector.s(this.template);
        if ($t) {
            this.$template = $t.innerHTML.trim();
        } else {
            //error
        }
        this.$compiler = new Compiler(this.$template);

        this.$args = this.$compiler.linkArgs;
        this.$tplfn = this.$compiler.tplFn;
    }

    update() {
        EventLoop.d_o(Render.mount.bind(Render, this, this.$data));
    }

}

export default Node;
