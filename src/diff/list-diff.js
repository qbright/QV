const listDiff = {
    REMOVE: 0,
    INSERT: 1,
    diff(oldList, newList, key) {
        let oldMap = this.convertListByKey(oldList, key),
            newMap = this.convertListByKey(newList, key);

        // console.log(oldMap, newMap);

        if (oldMap.free.length !== newMap.free.length) {
            console.log(oldMap, newMap);
            debugger;
        }

        let newFree = newMap.free;

        let oldKeyIndex = oldMap.keyIndex,
            newKeyIndex = newMap.keyIndex,
            moves = [],
            children = [],
            i = 0,
            item, itemKey, freeIndex = 0;


        const remove = (index) => {
            let move = { index, type: this.REMOVE };
            moves.push(move);
        }

        const insert = (index, item) => {
            let move = { index, item, type: this.INSERT };
            moves.push(move);
        }

        const removeSimulate = (index) => {
            simulateList.splice(index, 1);
        }

        while (i < oldList.length) { //在旧的 list 里面判断
            item = oldList[i];
            itemKey = this.getItemKey(item, key);
            if (itemKey) {
                if (!newKeyIndex[itemKey]) {
                    children.push(null);
                } else {
                    let newItemIndex = newKeyIndex[itemKey];
                    children.push(newList[newItemIndex]);
                }
            } else {
                let freeItem = newFree[freeIndex++];
                children.push(freeItem || null);
            }
            i++;
        }

        // console.log(children);
        let simulateList = children.slice(0);

        i = 0;

        while (i < simulateList.length) {
            if (simulateList[i] === null) {
                remove(i);
                removeSimulate(i);
            } else {
                i++;
            }

        }

        i = 0;
        let j = 0;

        while (i < newList.length) {
            item = newList[i];
            itemKey = this.getItemKey(item, key);

            let simulateItem = simulateList[j],
                simulateItemKey = this.getItemKey(simulateItem, key);

            // console.log(simulateItem, itemKey, simulateItemKey);
            if (simulateItem) {
                if (itemKey === simulateItemKey) {
                    j++;
                } else {
                    if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                        insert(i, item);
                    } else {

                        let nextItemKey = this.getItemKey(simulateList[j + 1], key);
                        if (nextItemKey === itemKey) {
                            remove(i);
                            removeSimulate(i);
                            j++
                        } else {
                            insert(i, item);
                        }
                    }
                }
            } else {
                insert(i, item);
            }

            i++;
        }

        let k = 0;
        while (j++ < simulateList.length) {
            remove(k + i);
            k++;
        }



        return { moves, children };

    },

    convertListByKey(list, key) {
        let keyIndex = {},
            free = [];

        for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i],
                itemKey = this.getItemKey(item, key);

            if (itemKey) {
                keyIndex[itemKey] = i;
            } else {
                free.push(item);
            }

        }

        return { keyIndex, free };

    },
    getItemKey(item, key) {
        if (!item || !key) {
            return void 0;
        }

        return typeof key === "string" ? item[key] : key(item);

    }

}

export default listDiff;
