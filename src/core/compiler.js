/**
 * Created by zhengqiguang on 2017/6/15.
 */

const compiler_helper = {
    generaltplFn(tpl){

        let patt = /{{[ \t]*([\w\W]*?)[ \t]*}}/g,
            result;

        let tempStrFn = "",
            fnArgs = [],
            cursor = 0;


        while ((result = patt.exec(tpl)) !== null) {

            console.log(result);

            var $temp1 = tpl.slice(cursor, result.index);
            cursor += $temp1.length;

            tempStrFn += this.wrapStaticBlock($temp1);

            // let $temp2 = tpl.slice(cursor, cursor + result[0].length);

            fnArgs.push(result[1]);
            tempStrFn += this.wrapDynamicBlock(result);
            cursor += result[0].length;
        }

        let tempLast = tpl.slice(cursor, tpl.length);


        tempStrFn += this.wrapStaticBlock(tempLast);

        let tplFn = this.gTplFn(tempStrFn);

        return {
            tplFn: tplFn,
            linkArgs: fnArgs
        }
    },
    wrapStaticBlock: function (str) {

        return "\'" + str + "\'";

    },
    wrapDynamicBlock: function (result) {

        return " + od." + result[1] + " + "
    },
    gTplFn: function (str) {

        let $t = "return " + str;

        $t = $t.replace(/\n/g, "");

        let $tempFn = new Function("od", $t);

        return $tempFn;

    }


}


class Compiler {


    constructor(tpl) {
        this.tpl = tpl;
        this.init(compiler_helper.generaltplFn(this.tpl));
    }

    init({tplFn, linkArgs}) {
        this.tplFn = tplFn;
        this.linkArgs = linkArgs;
    }

}


export default Compiler;
