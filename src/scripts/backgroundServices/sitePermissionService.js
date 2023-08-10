import { max } from "lodash";
import LRU from "lru-cache";

import createPersistStore from "./persistStore";

class SitePermissionService {
    store = {
        dumpCache: [],
    };
    lruCache;

    init = async () => {
        const storage = await createPersistStore({
            name: "site-permissions",
        });
        this.store = storage || this.store;

        this.lruCache = new LRU();
        const cache = (this.store.dumpCache || []).map((item) => ({
            k: item.k,
            v: item.v,
            e: 0,
        }));
        this.lruCache.load(cache);
    };

    sync = () => {
        if (!this.lruCache) return;
        this.store.dumpCache = this.lruCache.dump();
    };

    getWithoutUpdate = (key) => {
        if (!this.lruCache) return;
        return this.lruCache.peek(key);
    };

    getSite = (origin) => {
        return this?.lruCache?.get(origin);
    };

    setSite = (site) => {
        if (!this.lruCache) return;
        this.lruCache.set(site.origin, site);
        this.sync();
    };

    addConnectedSite = (origin, name, icon, isSigned = false) => {
        if (!this.lruCache) return;

        this.lruCache.set(origin, {
            origin,
            name,
            icon,
            isSigned,
            isTop: false,
            isConnected: true,
        });
        this.sync();
    };

    touchConnectedSite = (origin) => {
        if (!this.lruCache) return;

        this.lruCache.get(origin);
        this.sync();
    };

    updateConnectSite = (origin, value, partialUpdate) => {
        if (!this.lruCache || !this.lruCache.has(origin)) return;

        if (partialUpdate) {
            const _value = this.lruCache.get(origin);
            this.lruCache.set(origin, { ..._value, ...value });
        } else {
            this.lruCache.set(origin, value);
        }

        this.sync();
    };

    hasPermission = (origin) => {
        if (!this.lruCache) return;

        const site = this.lruCache.get(origin);
        return site && site.isConnected;
    };

    getRecentConnectedSites = () => {
        const sites = (this.lruCache?.values() || []).filter((item) => item.isConnected);
        const pinnedSites = sites
            .filter((item) => item?.isTop)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
        const recentSites = sites.filter((item) => !item.isTop);
        return [...pinnedSites, ...recentSites];
    };

    getConnectedSites = () => {
        return (this.lruCache?.values() || []).filter((item) => item.isConnected);
    };

    getAllConnectedSites = () => {
        return this.lruCache?.values() || [];
    };

    getConnectedSite = (key) => {
        const site = this.lruCache?.get(key);
        if (site && site.isConnected) {
            return site;
        }
    };

    topConnectedSite = (origin, order) => {
        const site = this.getConnectedSite(origin);
        if (!site || !this.lruCache) return;
        order =
            order ??
            (max(this.getRecentConnectedSites().map((item) => item.order)) || 0) + 1;
        this.updateConnectSite(origin, {
            ...site,
            order,
            isTop: true,
        });
    };

    unpinConnectedSite = (origin) => {
        const site = this.getConnectedSite(origin);
        if (!site || !this.lruCache) return;
        this.updateConnectSite(origin, {
            ...site,
            isTop: false,
        });
    };

    removeConnectedSite = (origin) => {
        if (!this.lruCache) return;
        const site = this.getConnectedSite(origin);
        if (!site) {
            return;
        }
        let updatedSite = {
            ...site,
            isConnected: false,
        };
        this.setSite({
            ...updatedSite,
        });
        this.sync();
    };

    removeSite = (origin) => {
        if (!this.lruCache) return;
        const site = this.getConnectedSite(origin);
        if (!site) {
            return;
        }
        this.lruCache.del(origin);
        this.sync();
    };

    getSitesByDefaultChain = (chain) => {
        if (!this.lruCache) return [];
        return this.lruCache.values().filter((item) => item.chain === chain);
    };
}

export default new SitePermissionService();
