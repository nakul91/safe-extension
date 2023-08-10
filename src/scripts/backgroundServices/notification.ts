import { ethErrors } from "eth-rpc-errors";
import { EthereumProviderError } from "eth-rpc-errors/dist/classes";
import Events from "events";
import { isEqual, omit } from "lodash";
import Browser from "webextension-polyfill";

import winMgr from "../webapi/window";

class NotificationService extends Events {
    currentApproval: any = null;
    _approvals: any = [];
    notifiWindowId = 0;
    isLocked = false;

    get approvals() {
        return this._approvals;
    }

    set approvals(val) {
        this._approvals = val;
        try {
            if (val.length <= 0) {
                Browser.action.setBadgeText({
                    text: "",
                });
            } else {
                Browser.action.setBadgeText({
                    text: val.length + "",
                });
                Browser.action.setBadgeBackgroundColor({
                    color: "#BB1500",
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    constructor() {
        super();
        winMgr.event.on("windowRemoved", (winId: number) => {
            if (winId === this.notifiWindowId) {
                this.notifiWindowId = 0;
                this.rejectAllApprovals();
            }
        });
    }

    activeFirstApproval = () => {
        if (this.notifiWindowId) {
            Browser.windows.update(this.notifiWindowId, {
                focused: true,
            });
            return;
        }

        if (this.approvals.length < 0) return;

        const approval = this.approvals[0];
        this.currentApproval = approval;
        this.openNotification(approval.winProps);
    };

    deleteApproval = (approval: any) => {
        if (approval && this.approvals.length > 1) {
            this.approvals = this.approvals.filter(
                (item: any) => approval.id !== item.id,
            );
        } else {
            this.currentApproval = null;
            this.approvals = [];
        }
    };

    getApproval = () => this.currentApproval;

    resolveApproval = async (data?: any, forceReject = false) => {
        if (forceReject) {
            this.currentApproval?.reject &&
                this.currentApproval?.reject(
                    new EthereumProviderError(4001, "User Cancel"),
                );
        } else {
            this.currentApproval?.resolve && this.currentApproval?.resolve(data);
        }

        const approval = this.currentApproval;

        this.deleteApproval(approval);

        if (this.approvals.length > 0) {
            this.currentApproval = this.approvals[0];
        } else {
            this.currentApproval = null;
        }

        this.emit("resolve", data);
    };

    rejectApproval = async (
        err?: string,
        stay = false,
        isInternal = false,
        code?: number,
    ) => {
        if (isInternal) {
            this.currentApproval?.reject &&
                this.currentApproval?.reject(ethErrors.rpc.internal(err));
        } else {
            this.currentApproval?.reject(
                ethErrors.provider.custom({
                    code: code ?? 4001,
                    message: err,
                }),
            );
        }

        const approval = this.currentApproval;

        if (approval && this.approvals.length > 1) {
            this.deleteApproval(approval);
            this.currentApproval = this.approvals[0];
        } else {
            await this.clear(stay);
        }
        this.emit("reject", err);
    };

    requestApproval = async (data: any, winProps?: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            const uuid = Date.now();
            const approval = {
                taskId: uuid,
                id: uuid,
                data,
                winProps,
                resolve,
                reject,
            };
            if (
                this.approvals.some(
                    (approveData: typeof approval) =>
                        approveData.data.method === approval.data.method &&
                        isEqual(
                            omit(approveData.data.params, ["name", "icon"]),
                            omit(approval.data.params, ["name", "icon"]),
                        ),
                )
            ) {
                return;
            } else {
                if (data.isUnshift) {
                    this.approvals = [approval, ...this.approvals];
                    this.currentApproval = approval;
                } else {
                    this.approvals = [...this.approvals, approval];
                    if (!this.currentApproval) {
                        this.currentApproval = approval;
                    }
                }
                if (
                    this.notifiWindowId &&
                    data?.method !== "wallet_switchEthereumChain"
                ) {
                    Browser.windows.update(this.notifiWindowId, {
                        focused: true,
                    });
                } else {
                    this.openNotification(approval.winProps);
                }
            }
        });
    };

    clear = async (stay = false) => {
        this.approvals = [];
        this.currentApproval = null;
        if (this.notifiWindowId && !stay) {
            await winMgr.remove(this.notifiWindowId);
            this.notifiWindowId = 0;
        }
    };

    rejectAllApprovals = () => {
        this.approvals.forEach((approval: any) => {
            approval.reject &&
                approval.reject(
                    new EthereumProviderError(4001, "User rejected the request."),
                );
        });
        this.approvals = [];
        this.currentApproval = null;
    };

    unLock = () => {
        this.isLocked = false;
    };

    lock = () => {
        this.isLocked = true;
    };

    openNotification = (winProps: any) => {
        if (this.notifiWindowId) {
            winMgr.remove(this.notifiWindowId);
            this.notifiWindowId = 0;
        }
        winMgr.openNotification(winProps).then((winId: any) => {
            this.notifiWindowId = winId;
        });
    };
}
export default new NotificationService();
