export class Session {
    origin = "";

    icon = "";

    name = "";

    pm = null;

    pushMessage(event, data) {
        if (this.pm) {
            this.pm.send("message", { event, data });
        }
    }

    constructor(data) {
        if (data) {
            this.setProp(data);
        }
    }

    setPortMessage(pm) {
        this.pm = pm;
    }

    setProp({ origin, icon, name }) {
        this.origin = origin;
        this.icon = icon;
        this.name = name;
    }
}

const sessionMap = new Map();

const getSession = (key) => {
    return sessionMap.get(key);
};

const getOrCreateSession = (id, origin, params) => {
    if (sessionMap.has(`${id}-${origin}`)) {
        return getSession(`${id}-${origin}`);
    }

    return createSession(`${id}-${origin}`, params);
};

const createSession = (key, data) => {
    const session = new Session(data);
    sessionMap.set(key, session);
    return session;
};

const deleteSession = (key) => {
    sessionMap.delete(key);
};

const broadcastEvent = (ev, data, origin) => {
    let sessions = [];
    sessionMap.forEach((session, key) => {
        if (session) {
            sessions.push({
                key,
                data: session,
            });
        }
    });

    // same origin
    if (origin) {
        sessions = sessions.filter((session) => session.data.origin === origin);
    }

    sessions.forEach((session) => {
        try {
            session.data.pushMessage?.(ev, data);
        } catch (e) {
            if (sessionMap.has(session.key)) {
                deleteSession(session.key);
            }
        }
    });
};

export default { broadcastEvent, deleteSession, getOrCreateSession, getSession };
