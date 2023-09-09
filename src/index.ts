import { TongYiService } from "./chat/tongyi.chat";
import { XunFeiWsService } from "./chat/xunfei.chat";

export const xunFeiService = new XunFeiWsService();

export const tongYiService = new TongYiService();
