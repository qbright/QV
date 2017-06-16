/**
 * Created by zhengqiguang on 2017/6/15.
 */

import _for from "./for";

var dsl_prefix = "dsl-";

const dslMap = {};

class DSL {
    constructor() {
        this.initAll();
    }

    initAll() {
        dslMap[`${dsl_prefix}${_for.name}`] = _for;
    }

    get dslMap() {
        return dslMap;
    }
}


export default new DSL();
