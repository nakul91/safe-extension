import compose from "koa-compose";

export default class PromiseFlow {
    _tasks = [];
    _context = {};
    requestedApproval = false;

    use(fn) {
        if (typeof fn !== "function") {
            throw new Error("promise need function to handle");
        }
        this._tasks.push(fn);

        return this;
    }

    callback() {
        return compose(this._tasks);
    }
}
