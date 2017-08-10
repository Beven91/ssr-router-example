/**
 *  用于记录路由数据，用于判断当前路由(pushstate)是前进还是后台
 *  
 */

//判断是否为nodejs服务端运行react
const isNodeServerRuntime = global.__CLIENT__ !== true

export default class NavigateHelper {

    static getCurrentStateID() {
        return parseInt(window.localStorage.getItem("currentStateID") || 0);
    }

    static setCurrentStateID(id) {
        window.localStorage.setItem("currentStateID", id);
    }

    static genStateID() {
        let stateid = window.localStorage.getItem("stateid") || "0";
        var id = parseInt(stateid) + 1;
        window.localStorage.setItem("stateid", id);
        return id;
    }

    static initRoute() {
        if (!isNodeServerRuntime) {
            const history = window.history;
            const state = history.state;
            const id = (state && state.id > 0) ? state.id : this.genStateID();
            this.setCurrentStateID(id);
            if (!state) {
                history.replaceState({ id: id }, '', window.location.href);
            }
        }
        this.initRoute = (empty) => empty;
    }

    static isForward(ispopstate) {
        if (!isNodeServerRuntime) {
            const history = window.history;
            const state = history.state;
            return (state && state.id > this.getCurrentStateID()) && !ispopstate
        }
    }
}