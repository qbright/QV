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
            console.log(walker.index - 1, child);
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
                    console.log(currentPatch);
                    let newNode = vDomToDom.compiler(currentPatch.newNode);
                    node.parentNode.replaceChild(newNode, node);
                    break;

                case this.REORDER:
                    this.reorderChildren(node, currentPatch.moves);
                    break;

                case this.ATTRS:
                    this.setAttrs(node, currentPatch.props);
                    break;
                case this.TEXT:
                    node.textContent = currentPatch.newNode.content;
                    break;
                default:
                    throw new Error(`Unkown patch type ${currentPach.type}`);
            }


        });

    },
    setAttrs(node, attrs) {
        for (var key in attrs) {
            if (attrs[key] === void 0) {
                node.removeAttribute(key);
            } else {
                var value = attr[key]
                _.setAttr(node, key, value);
            }
        }

    },
    reorderChildren(node, moves) {
        let staticNodeList = _.toArray(node.childNodes),
            maps = {};

        _.each(staticNodeList, node => {
            if (node.nodeType === 1) {
                let key = node.getAttribute("key");
                key && (maps[key] = node);
            }
        });

        _.each(moves, move => {
            let index = move.index;
            if (move.type === 0) {
                if (staticNodeList[index] === node.childNodes[index]) {
                    node.removeChild(node.childNodes[index]);
                }
                staticNodeList.splice(index, 1);
            } else if (move.type === 1) {
                let insertNode = maps[move.item.key] ? maps[move.item.key] : vDomToDom.compiler(move.item);
                staticNodeList.splice(index, 0, insertNode);
                node.insertBefore(insertNode, node.childNodes[index] || null);
            }
        });


    }



}



export default patch;