/**
 * Created by zhengqiguang on 2017/6/15.
 */


import compiler_helper from "../compiler/compiler-helper";

const render = {

    mount($node, $data){

        compiler_helper.data = $data;

        let $newDom = this.generalDom($node.$tplfn(compiler_helper));

        this.replaceNode($newDom, $node);

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