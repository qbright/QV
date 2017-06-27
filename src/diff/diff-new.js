import _ from "../common/util";
import patch from "./patch";
import listDiff from "./list-diff";

const diff = {
    d_o(oldTree, newTree) {
        let index = 0,
            patches = {};

        this.dfsWalk(oldTree, newTree, index, patches);


        return patches;

    },
    /**
     * 深度优先遍历 
     * @param {*} oldTree 
     * @param {*} newTree 
     * @param {*} index 
     * @param {*} patches 
     */
    dfsWalk(oldNode, newNode, index, patches) {

        let currentPatch = [];

        if (!newNode) { //节点被删除

        } else if (oldNode.type === "text" && newNode.type === "text") {
            if (oldNode.content !== newNode.content) {
                currentPatch.push({ type: patch.TEXT, newNode });
            }
        } else if ((oldNode.type === "tag" && newNode.type === "tag") && //如果 type 和标签名是一样的
            (oldNode.tagName === newNode.tagName)) {
            let propsPatches = this.attrDiff(oldNode.attrs, newNode.attrs);
            if (propsPatches) {
                currentPatch.push({ type: patch.ATTRS, props: propsPatches });
            }
            this.diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
        } else {
            currentPatch.push({ type: patch.REPLACE, node: newNode });
        }

        if (currentPatch.length) {
            patches[index] = currentPatch;
        }

    },
    diffChildren(oldChildren, newChildren = [], index, patches, currentPatch) {

        let diffs = listDiff.diff(oldChildren, newChildren, 'key');

        console.log(diffs);

        newChildren = diffs.children;

        if (diffs.moves.length) {
            currentPatch.push({ type: patch.REORDER, moves: diffs.moves });
        }

        let leftNode = null,
            currentNodeIndex = index;

        _.each(oldChildren, (child, i) => {
            let newChild = newChildren[i];
            currentNodeIndex = (leftNode && leftNode.count) ? (currentNodeIndex + leftNode.count + 1) : (currentNodeIndex + 1);

            this.dfsWalk(child, newChild, currentNodeIndex, patches);

            leftNode = child;

        });

    },

    attrDiff(oldAttrs, newAttrs) {

        let count = 0

        var key, value
        var propsPatches = {}

        // Find out different properties
        for (key in oldAttrs) {
            value = oldAttrs[key]
            if (newAttrs[key] !== value) {
                count++
                propsPatches[key] = newAttrs[key]
            }
        }

        // Find out new property
        for (key in newAttrs) {
            value = newAttrs[key]
            if (!oldAttrs[key]) {
                count++
                propsPatches[key] = newAttrs[key]
            }
        }

        // If properties all are identical
        if (count === 0) {
            return null
        }
        return propsPatches
    }


}


export default diff;

