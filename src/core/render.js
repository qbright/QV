/**
 * Created by zhengqiguang on 2017/6/15.
 */


import compiler_helper from "../compiler/compiler-helper";
import v_dom_to_dom from "../compiler/v-dom-to-dom";
import diff from "../compiler/diff";

const render = {

    mount($node, $data){

        compiler_helper.data = $data;

        let $vdom = $node.$tplfn(compiler_helper);


        if (!$node.$vDom) {//还没有 vdom，说明是初始化

            let $d = v_dom_to_dom.compiler($vdom.value);
            $node.$vDom = $vdom;
            this.replaceNode($d, $node);
        } else {

            diff.d_o($node.$vDom, $vdom);

            $node.$vDom = $vdom;

        }
        //
        //
        // let $newDom = this.generalDom($node.$tplfn(compiler_helper));
        //
        // this.replaceNode($newDom, $node);

    },

    generalDom(domStr){

        if (domStr instanceof Object) {
            return domStr.value;
        }

        var $temp = document.createElement("div");
        $temp.innerHTML = domStr.trim(); //不然会有多余的空格等东西
        return $temp.childNodes[0];
    },

    replaceNode(newDom, node){
        let $el = node.$el;

        $el.parentNode.replaceChild(newDom, $el);

        node.$el = newDom;
    }


}


export default render;