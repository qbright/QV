/**
 * Created by zhengqiguang on 2017/6/15.
 */
import common from "../common/common";

const helper = {
    insertOD($targetData, $data){

        !$targetData && ($targetData = {});

        for (let key in $data) {
            let type = common.checkType($data[key]);

            if (type === "Object") {
                let $tempTargetData = {};
                this.insertOD($tempTargetData, $data[key]);
                $targetData[key] = {
                    value: $data[key],
                    linkNodes: [],
                    mounted: false,
                    _od_: $tempTargetData
                }

            } else {

                $targetData[key] = {
                    value: $data[key],
                    linkNodes: [],
                    mounted: false
                }
            }

        }

        return $targetData;

    }


}

class Data {

    static formatData(data = {}) {
        data["_od_"] = helper.insertOD(data["_od_"], data);
        return data;
    }


}

export default Data;
