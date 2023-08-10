class EventBus {
    events = {};

    emit = (type, params) => {
        const listeners = this.events[type];
        if (listeners) {
            listeners.forEach((fn) => {
                fn(params);
            });
        }
    };

    once = (type, fn) => {
        const listeners = this.events[type];
        const func = (...params) => {
            fn(...params);
            this.events[type] = this.events[type].filter((item) => item !== func);
        };
        if (listeners) {
            this.events[type].push(func);
        } else {
            this.events[type] = [func];
        }
    };

    addEventListener = (type, fn) => {
        const listeners = this.events[type];
        if (listeners) {
            this.events[type].push(fn);
        } else {
            this.events[type] = [fn];
        }
    };

    removeEventListener = (type, fn) => {
        const listeners = this.events[type];
        if (listeners) {
            this.events[type] = this.events[type].filter((item) => item !== fn);
        }
    };

    removeAllEventListeners = (type) => {
        this.events[type] = [];
    };
}

export default new EventBus();
