/**
 * Created by zhengqiguang on 2017/6/26.
 */
import vDomToDom from "./v-dom-to-dom";


let handlerDiff = {
    do_diff($diffTree){

        console.log($diffTree);
        this.walker($diffTree);

    },
    walker($diff){
        if ($diff.diff.length) {
            let $r = true;

            for (let i = 0, d; d = $diff.diff[i]; i++) {

                if (d.diff.indexOf("tagName") !== -1 || d.diff.indexOf("content") !== -1) { //标签被换掉了
                    $r = this.replaceNode(d.$oldDom, d.$dom);
                }

                if (d.diff.indexOf("remove") !== -1) { //标签被删除了
                    $r = this.removedNode(d.$oldDom);
                }

                $r && this.walkerChildren(d.children);

            }

        } else {
            if ($diff.children && $diff.children.length) {

                // console.log(2, $diff.children);
                this.walkerChildren($diff.children);
            }
        }

    },
    walkerChildren($diffs = []){
        for (let i = 0, $d; $d = $diffs[i]; i++) {
            this.walker($d);
        }
    },
    replaceNode($oldDom, $dom){
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
    removedNode($dom){
        $dom.$rDom.parentNode.removeChild($dom.$rDom);
        return false;
    }


}

export default handlerDiff;