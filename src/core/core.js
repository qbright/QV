/**
 * Created by zhengqiguang on 2017/6/14.
 */

import Node from "./node";
import Watcher from "./watcher";
import Data from "./data";
import render from "./render";

class QV {
    constructor(opt = {}) {
        this._$opt = opt;

        this.formatOption(opt);

        this.mountRoot();

    }

    formatOption(opt) {

        this.$data = Data.formatData(opt.data);

        this.$root = new Node(opt);

        this.$watcher = new Watcher(this.$data);

        this.$watcher.linkNode(this.$root);

    }

    mountRoot() {
        render.mount(this.$root, this.$data);
    }


}


export  default QV;
