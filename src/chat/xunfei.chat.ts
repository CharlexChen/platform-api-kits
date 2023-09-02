import { XunFeiOutput } from '../interface/xunfei';
import { GptChatBase } from '../abstract/gpt-chat-base';
import {
  GPTChatCompletionInput,
  GPTChatCompletionOutput,
} from '../interface/gpt-chat-completion';
import { XunFeiInput } from '../interface/xunfei';
import {
  XunFei_APIAppid,
  XunFei_domain,
  generateXunfeiUrl,
} from '../utils/xunfei-kit';
import WebSocket from 'ws';

const label = '[xunfei.ws.service]';

export class XunFeiWsService extends GptChatBase {
  protected stopStatus = 2;
  constructor() {
    super('xunfei');
    console.log('>>>', this.url);
  }
  async getConnection() {
    // 连接WebSocket服务
    const socket: WebSocket = await new Promise((resolve) => {
      const client = new WebSocket(generateXunfeiUrl());
      client.on('open', () => {
        resolve(client);
      });
    });

    // 监听WebSocket响应
    socket.on('message', (data: unknown) => {
      const res = JSON.parse(Buffer.from(data as never, 'utf-8').toString());
      if (res.header.code != 0) {
        this.status = this.stopStatus;
        return false;
      }
      if (this.responseChunk) {
        this.responseChunk += res.payload.choices.text[0].content;
      } else {
        this.responseChunk = res.payload.choices.text[0].content;
      }
      this.responseRaw = res;
      this.status = res.payload.choices.status;
      // this.response = Buffer.from(data, 'utf-8').toString();
      return undefined;
    });
    socket.on('close', (err: unknown) => {
      console.log('>>>on ws close', err);
    });
    return socket;
  }
  async waitForResponse() {
    // 等待WebSocket响应
    while (this.status !== this.stopStatus) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    // 返回WebSocket响应
    const response = this.responseChunk;
    const rawData = this.responseRaw as unknown as XunFeiOutput;
    this.responseChunk = undefined;
    this.responseRaw = undefined;
    this.status = undefined;
    return {
      ...rawData,
      response,
    };
  }
  async sendData(
    content: XunFeiInput,
  ): Promise<XunFeiOutput & { response?: string }> {
    // 连接WebSocket服务
    let socket = await this.getConnection();
    // 发送WebSocket消息
    socket.send(JSON.stringify(content));
    // 等待WebSocket服务返回结果
    const result = await this.waitForResponse();
    // 关闭socket连接
    socket.terminate();
    socket = null as never;
    return result;
  }
  async sendChatData(
    data: GPTChatCompletionInput,
  ): Promise<GPTChatCompletionOutput> {
    const result = await this.sendData({
      header: {
        app_id: XunFei_APIAppid as string,
        uid: '1238989',
      },
      parameter: {
        chat: {
          domain: XunFei_domain,
          temperature: 0.5,
          max_tokens: 1024,
        },
      },
      payload: {
        message: {
          text: data.messages,
        },
      },
    });
    console.log(label, 'sendChatData', result);
    return {
      id: result?.header?.sid,
      choices: [
        {
          finish_reason: 'stop',
          index: 0,
          message: {
            content: result?.response as string,
            role: 'assistant',
          },
        },
      ],
      created: Date.now(),
      model: data.model,
      usage: result?.payload?.usage?.text,
    };
  }
}
