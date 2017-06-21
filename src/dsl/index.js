/**
 * Created by zhengqiguang on 2017/6/15.
 */


var dsl_prefix = "dsl-";

const dslMap = {
    "dsl-if": 1,
    "dsl-for": 1,
    "dsl-html": 1
};

class DSL {
    constructor() {
        this.initAll();
    }

    initAll() {
    }

    get dslMap() {
        return dslMap;
    }
}


export default new DSL();
