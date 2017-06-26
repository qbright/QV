/**
 * Created by zhengqiguang on 2017/6/23.
 */

import VNode from "./VNode";

class VText extends VNode {

    constructor(content) {
        super(null, "text");
        this.content = content;
    }
}

export  default VText;
