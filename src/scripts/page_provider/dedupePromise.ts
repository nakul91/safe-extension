import { ethErrors } from "eth-rpc-errors";

/*
 caches duplicated promise calls if there's a pending one, so concurrent 
 promise calls trigger only one actual task.
 */
class DedupePromise {
    private _blackList: string[];
    private _tasks: Record<string, number> = {};

    constructor(blackList: string[]) {
        this._blackList = blackList;
    }

    async call(key: string, defer: () => Promise<any>) {
        if (this._blackList.includes(key) && this._tasks[key]) {
            throw ethErrors.rpc.transactionRejected(
                "there is a pending request, please request after it resolved",
            );
        }

        return new Promise((resolve) => {
            this._tasks[key] = (this._tasks[key] || 0) + 1;

            resolve(
                defer().finally(() => {
                    this._tasks[key]--;
                    if (!this._tasks[key]) {
                        delete this._tasks[key];
                    }
                }),
            );
        });
    }
}

export default DedupePromise;
