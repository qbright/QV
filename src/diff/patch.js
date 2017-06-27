import _ from "../common/util";
import vDomToDom from "./v-dom-to-dom";
const patch = {
    REPLACE: 0,
    REORDER: 1,
    ATTRS: 2,
    TEXT: 3,
    patch(node, patches) {
        let walker = { index: 0 };
        this.dfsWalk(node, walker, patches);

    },
    dfsWalk(node, walker, patches) {
        let currentPatches = patches[walker.index],
            len = node.childNodes ? node.childNodes.length : 0;

        for (let i = 0; i < len; i++) {
            let child = node.childNodes[i];
            walker.index++;
            this.dfsWalk(child, walker, patches);
        }

        if (currentPatches) {
            this.applyPatches(node, currentPatches);
        }


    },
    applyPatches(node, currentPatches) {
        _.each(currentPatches, currentPatch => {

            switch (currentPatch.type) {
                case this.REPLACE:
                    let newNode = vDomToDom.compiler(currentPatch.node);
                    node.parentNode.replaceChild(newNode, node);
                    break;

                case this.REORDER:
                    this.reorderChildren(node, currentPatch.moves);
                    break;

                case this.ATTRS:
                    this.setAttrs(node, currentPatch.props);
                    break;
                case this.TEXT:
                    node.textContent = currentPatch.node.content;
                    break;
                default:
                    throw new Error(`Unkown patch type ${currentPach.type}`);
            }


        });

    },
    setAttrs(node, attrs) {


    },
    reorderChildren(node, moves) {

    }



}



export default patch;