/**
 * Created by zhengqiguang on 2017/6/15.
 */


import compiler_helper from "../diff/compiler-helper";
import v_dom_to_dom from "../diff/v-dom-to-dom";
import diff from "../diff/diff-new";
import patch from "../diff/patch";

const render = {

    mount($node, $data) {

        compiler_helper.data = $data;

        let $vdom = $node.$tplfn(compiler_helper);

        if (!$node.$vDom) {//还没有 vdom，说明是初始化
            let $d = v_dom_to_dom.compiler($vdom.value);
            $node.$vDom = $vdom;
            this.replaceNode($d, $node);
        } else {

            let patches = diff.d_o($node.$vDom.value, $vdom.value);
            console.warn("warn:", patches);
            patch.patch($node.$el, patches);

            $node.$vDom = $vdom;
        }

    },

    generalDom(domStr) {

        if (domStr instanceof Object) {
            return domStr.value;
        }

        var $temp = document.createElement("div");
        $temp.innerHTML = domStr.trim(); //不然会有多余的空格等东西
        return $temp.childNodes[0];
    },

    replaceNode(newDom, node) {
        let $el = node.$el;

        $el.parentNode.replaceChild(newDom, $el);

        node.$el = newDom;
    }


}


export default render;