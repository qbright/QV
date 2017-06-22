/**
 * Created by zhengqiguang on 2017/6/15.
 */

const typeReg = /\[object ([\w\W]+?)\]/;

const gettype = Object.prototype.toString;

const common = {
    checkType(thing){
        return gettype.call(thing).match(typeReg)[1];
    },
    formatParam(str){
        let $s = str.split(".");
        return JSON.stringify($s);
    },
    getItemData(data, itemNameSet){

        if (itemNameSet.length == 1) {
            if (!data) {
                return void 0;
            }
            return data[itemNameSet[0]];
        } else {
            return this.getItemData(data[itemNameSet.shift()], itemNameSet);
        }

    },
    getOdItemData(data, itemNameSet){
        if (itemNameSet.length == 1) {
            if (!data) {
                return void 0;
            }
            return data[itemNameSet[0]];
        } else {
            return this.getOdItemData(data[itemNameSet.shift()]["_od_"], itemNameSet);
        }

    }

}


export default common;