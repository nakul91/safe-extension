import Browser from "webextension-polyfill";

const TIMEOUT_OPTION = {
    900000: 15.0,
    1800000: 30.0,
    3600000: 60.0,
    10800000: 180.0,
    21600000: 360.0,
};

export enum ALARM_EVENT_ENUMS {
    TIMEOUT = "front-auto-lock-timer-interval",
}

export type TTimeoutoptions = 900000 | 1800000 | 3600000 | 10800000 | 21600000;

export interface IAlarm {
    name: string;
    scheduledTime: number;
}

class Alarms {
    delay: TTimeoutoptions;
    constructor() {
        this.delay = 900000;
    }
    creteAlarm(name: string, delay: TTimeoutoptions, callback: any, custom?: number) {
        this.delay = delay;
        Browser.alarms.create(name, {
            delayInMinutes: custom?.toString() ? custom : TIMEOUT_OPTION[delay],
        });
        this.listener(callback);
    }

    listener(callback: any) {
        Browser.alarms.onAlarm.addListener((alarm: IAlarm) => {
            callback(alarm);
        });
    }

    clearAllAlarm() {
        Browser.alarms.clearAll();
    }

    async getAllAlarm() {
        const allAlarms = await Browser.alarms.getAll();
        return allAlarms;
    }

    async getAlarm(name: ALARM_EVENT_ENUMS) {
        const alarm = await Browser.alarms.get(name);
        return alarm;
    }

    async resetAlarm(name: string, custom?: number) {
        Browser.alarms.clear(name);
        Browser.alarms.create(name, {
            delayInMinutes: custom?.toString() ? custom : TIMEOUT_OPTION[this.delay],
        });
    }
}

export default new Alarms();
