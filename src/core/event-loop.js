/**
 * Created by zhengqiguang on 2017/6/15.
 */


let EventLoop = {
    d_o(fn) {
        fn();

        // let p = Promise.resolve();
        // p.then(fn).catch((e) => {
        //     console.log(e);
        // });
    }

}

export default EventLoop;
