/**
 * Created by zhengqiguang on 2017/6/15.
 */
import common from "../common/common";

class Watcher {
    constructor(data) {
        this.$data = data;
        this.mountWatcher(this.$data, this.$data["_od_"]);

    }

    mountWatcher($data, od) {

        for (let key in $data) {


            (function (key) {

                var type = common.checkType($data[key]);


                let timeoutHandler = null;

                if (key !== "_od_" && !od[key].mounted) {
                    if (!od[key]) {
                        throw new Error(`data:${key} is init `);
                    }
                    Object.defineProperty($data, key, {
                        get () {
                            return od[key].value;
                        },
                        set(value) {
                            console.log(123123123);

                            clearTimeout(timeoutHandler);
                            setTimeout(() => {
                                if (value !== od[key].value) {


                                    var $n = od[key].linkNodes;
                                    od[key].value = value;
                                    for (var i = 0, n; n = $n[i]; i++) {
                                        n.update();
                                    }
                                }
                            }, 1000 / 60);//一帧节流

                        }
                    });
                    od[key].mounted = true;
                    if (type === "Object") {
                        this.mountWatcher($data[key], od[key]["_od_"]);
                    }
                }

            }.bind(this))(key);

        }
    }

    linkNode($node) {

        for (let i = 0, n; n = $node.$args[i]; i++) {

            let $s = common.formatParam(n);

            let $c = common.getItemData(this.$data, JSON.parse($s));

            let $d = common.getOdItemData(this.$data["_od_"], JSON.parse($s));

            if ($c !== undefined &&
                $d !== undefined &&
                $d.linkNodes.indexOf($node) === -1) {

                $d.linkNodes.push($node);

            }
        }
    }


    updateData() {


    }


}


export default Watcher;
