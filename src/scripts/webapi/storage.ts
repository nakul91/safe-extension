import Browser from "webextension-polyfill";

let cacheMap: Map<string, any>;

const get = async <T>(prop: string): Promise<T> => {
    if (cacheMap) {
        return cacheMap.get(prop);
    }

    const result = await Browser.storage.local.get(null);
    cacheMap = new Map(Object.entries(result ?? {}).map(([k, v]) => [k, v]));

    return prop ? result?.[prop] : result;
};

const set = async <T>(prop: string, value: T): Promise<void> => {
    await Browser.storage.local.set({ [prop]: value });
    cacheMap.set(prop, value);
};

export default {
    get,
    set,
};
