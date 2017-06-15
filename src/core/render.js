/**
 * Created by zhengqiguang on 2017/6/15.
 */



const render = {

    mount($node, $data){

        let $newDom = this.generalDom($node.$tplfn($data));

        this.replaceNode($newDom, $node);

    },

    generalDom(domStr){
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