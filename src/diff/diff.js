/**
 * Created by zhengqiguang on 2017/6/23.
 */

import handlerDiff from "./handlerDiff";

const diff = {
    d_o($oldDom, $dom) {
        this.walker($oldDom.value, $dom.value);
    },
    walker($oldDom, $dom) {

        let $d = this.doDiff($oldDom, $dom);

        if ($d.diff.indexOf("tagName") == -1) { //如果 tag 不同，则直接整个元素替换

            let l = Math.max(($oldDom && $oldDom.children.length) || 0, ($dom && $dom.children.length) || 0);

            for (let i = 0; i < l; i++) {
                this.walker($oldDom && $oldDom.children[i], $dom && $dom.children[i]);
            }

        }

    },

    doDiff($oldDom, $dom) {

        let d = {
            diff: [],
            $oldDom,
            $dom
        };

        if (!$oldDom) {
            d.diff.push("add");
            // console.warn("add diff");
        }

        if (!$dom) {
            d.diff.push("remove");
            // console.warn("remove diff");
        }

        if (!$oldDom || !$dom) {
            return d;
        }


        if ($oldDom.tagName !== $dom.tagName || $oldDom.type !== $dom.type) {//如果是 tagName 不同或者是 type 不同
            d.diff.push("tagName")
            // console.warn("tagName or type diff");
        }

        if (JSON.stringify($oldDom.attrs) !== JSON.stringify($dom.attrs)) {

            d.diff.push("attrs")
            // console.warn("attrs diff");
        }

        if ($oldDom.content !== $dom.content) {
            d.diff.push("content")
            // console.warn("content diff", $oldDom, $dom);
        }

        if ($oldDom.innerHtml !== $dom.innerHtml) {
            d.diff.push("innerHTML")
            // console.warn("innerHtml diff");
        }

        return d;

    }


}

export default diff;
