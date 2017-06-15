/**
 * Created by zhengqiguang on 2017/6/15.
 */

const helper = {
    insertOD($targetData, $data){

        !$targetData && ($targetData = {});

        for (var key in $data) {
            $targetData[key] = {
                value: $data[key],
                linkNodes: [],
                mounted: false
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
