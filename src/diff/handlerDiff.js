/**
 * Created by zhengqiguang on 2017/6/26.
 */
import vDomToDom from "./v-dom-to-dom";


let handlerDiff = {
    do_diff($diffTree) {

        this.walker($diffTree);

    },
    walker($diff) {
        if ($diff.diff.length) {
            let $r = true;

            for (let i = 0, d; d = $diff.diff[i]; i++) {

                if (d.diff.indexOf("tagName") !== -1 || d.diff.indexOf("content") !== -1) { //标签被换掉了
                    $r = this.replaceNode(d.$oldDom, d.$dom);
                }

                if (d.diff.indexOf("remove") !== -1) { //标签被删除了
                    $r = this.removedNode(d.$oldDom);
                }

                if (d.diff.indexOf("add") !== -1) {

                    if (i == ($diff.diff.length - 1)) {//最后一个，直接插入
                        $r = this.addNode(d.$dom);
                    }
                }

                $r && this.walkerChildren(d.children);
            }

        } else {
            if ($diff.children && $diff.children.length) {
                this.walkerChildren($diff.children);
            }
        }

    },
    walkerChildren($diffs = []) {
        console.log($diffs);
        for (let i = 0, $d; $d = $diffs[i]; i++) {
            this.walker($d);
        }
    },
    replaceNode($oldDom, $dom) {
        console.log(1);
        if ($oldDom.type !== "frag") {
            $oldDom.$rDom.parentNode.replaceChild(vDomToDom.compiler($dom), $oldDom.$rDom);
        } else { //针对 frag 做特殊处理
            this.replaceNode($oldDom.children[0], $dom);
            for (let i = 1, c; c = $oldDom.children[i]; i++) {
                this.removedNode(c);
            }
        }
        return false;
    },
    removedNode($dom) {
        console.log(2);
        $dom.$rDom.parentNode.removeChild($dom.$rDom);
        return false;
    },
    addNode($dom) { //插入到当前节点的后面
        console.log(3, $dom);
        let $a = $dom.prev.$rDom.nextSibling;
        $dom.prev.$rDom.parentNode.insertBefore(vDomToDom.compiler($dom), $a);
        return true;
    }


}

export default handlerDiff;
