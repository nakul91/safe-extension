import { COMMUNICATION_PAGES } from "./constants";

interface IBroadcastRequest<T> {
    method: string;
    params: any;
    data: T;
    sender?: COMMUNICATION_PAGES;
}

export type { IBroadcastRequest };
