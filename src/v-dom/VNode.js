/**
 * Created by zhengqiguang on 2017/6/23.
 */

class VNode {
    constructor(tagName = "", type) {
        this.tagName = tagName;
        this.type = type;
        this.attrs = Object.create(null);
        this.children = [];

        this._innerHtml = null;
    }

    appendChild(VDom) {
        this.children.push(VDom);
    }

    setAttribute(k, v) {
        this.attrs[k] = v;
    }

    set innerHtml(value) {
        this._innerHtml = value;
    }

    get innerHtml() {
        return this._innerHtml;
    }
}

export default VNode;
