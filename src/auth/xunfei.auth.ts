import { XunFei_version, assembleWsAuthUrl } from "../utils/xunfei-kit";

class XunFeiAuth {
  constructor() {}
  generateWsUrl(hostUrl = `wss://spark-api.xf-yun.com/${XunFei_version}/chat`) {
    return assembleWsAuthUrl(hostUrl);
  }
}
export const xunFeiAuth = new XunFeiAuth();