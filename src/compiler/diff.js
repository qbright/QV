/**
 * Created by zhengqiguang on 2017/6/23.
 */

const diff = {
    d_o($oldDom, $dom){
        this.walker($oldDom.value, $dom.value);
    },
    walker($oldDom, $dom){

        this.doDiff($oldDom, $dom);

        let l = Math.max($oldDom.children.length || 0, $dom.children.length || 0);

        for (let i = 0; i < l; i++) {
            this.walker($oldDom.children[i], $dom.children[i]);
        }

    },

    doDiff($oldDom, $dom){

        let d = {
            diff: [],
            $oldDom,
            $dom
        };

        if ($oldDom.tagName !== $dom.tagName || $oldDom.type !== $dom.type) {//如果是 tagName 不同或者是 type 不同
            d.diff.push("tagName")
            console.warn("tagName or type diff");
        }

        if (JSON.stringify($oldDom.attrs) !== JSON.stringify($dom.attrs)) {

            d.diff.push("attrs")
            console.warn("attrs diff");
        }

        if ($oldDom.content !== $dom.content) {
            d.diff.push("content")
            console.warn("content diff", $oldDom, $dom);
        }

        if ($oldDom.innerHtml !== $dom.innerHtml) {
            d.diff.push("innerHTML")
            console.warn("innerHtml diff");
        }
    }


}

export default diff;
