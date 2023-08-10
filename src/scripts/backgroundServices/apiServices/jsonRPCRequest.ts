import { walletController } from "..";

class JsonRPC {
  jsonRpcUrl: string;
  constructor() {
    this.jsonRpcUrl = "";
  }

  async init(chain?: string) {
    let chainRpc = "";
    if (chainRpc) {
      this.jsonRpcUrl = chainRpc;
    }
  }

  request = (method: string, params?: any) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params,
      id: 1,
    });

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };
    return fetch(this.jsonRpcUrl, requestOptions).then((response) => response.json());
  };
}

export default new JsonRPC();
