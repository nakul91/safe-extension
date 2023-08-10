import { debounce } from "debounce";

import { browserStorage } from "../webapi";

const persistStorage = <T>(name: string, obj: T) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    debounce(browserStorage.set<T>(name, obj), 500);
};

interface ICreatePersistStoreParams<T> {
    name: string;
    template?: T;
    fromStorage?: boolean;
}

const createPersistStore = async <T extends object>({
    name,
    template = Object.create(null),
    fromStorage = true,
}: ICreatePersistStoreParams<T>): Promise<T> => {
    let tpl = template;

    if (fromStorage) {
        const storageCache = await browserStorage.get<T>(name);
        tpl = storageCache || template;
        if (!storageCache) {
            await browserStorage.set(name, tpl);
        }
    }

    const createProxy = <T extends object>(obj: T): T =>
        new Proxy(obj, {
            set(target: any, prop: string, value) {
                target[prop] = value;

                persistStorage(name, target);

                return true;
            },

            deleteProperty(target, prop) {
                if (Reflect.has(target, prop)) {
                    Reflect.deleteProperty(target, prop);

                    persistStorage(name, target);
                }

                return true;
            },
        });
    return createProxy<T>(tpl);
};

export default createPersistStore;
