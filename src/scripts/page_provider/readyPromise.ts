/* A Promise which will resolve after all checks are made */

class ReadyPromise {
    private _allCheck: boolean[] = [];
    private tasks: {
        resolve(value: unknown): void;
        fn(): Promise<any>;
    }[] = [];

    constructor(count: number) {
        this._allCheck = [...Array(count)];
    }

    check = (index: number) => {
        this._allCheck[index - 1] = true;
        this._proceed();
    };

    uncheck = (index: number) => {
        this._allCheck[index - 1] = false;
    };

    private _proceed = () => {
        if (this._allCheck.some((_) => !_)) {
            return;
        }

        while (this.tasks.length) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { resolve, fn } = this.tasks.shift()!;
            resolve(fn());
        }
    };

    call = (fn: () => Promise<any>) => {
        return new Promise((resolve) => {
            this.tasks.push({
                fn,
                resolve,
            });

            this._proceed();
        });
    };
}

export default ReadyPromise;
