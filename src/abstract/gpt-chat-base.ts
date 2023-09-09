import {
  GPTChatCompletionInput,
  GPTChatCompletionOutput,
} from "../interface/gpt-chat-completion";

export abstract class GptChatBase {
  protected model: string;
  /**
   * this url that communicate with the larger model
   * @returns 
   */
  protected url: string;
  /**
   * request type
   */
  protected transferType: "http-json" | "websocket" | "http-sse";
  /**
   * the raw response
   */
  protected responseRaw?: string;
  /**
   * websocket or http-sse concat the chunk
   */
  protected responseChunk?: string;
  protected status?: number | string;
  protected stopStatus?: number | string;
  constructor(model: string, url = "", transferType = "http-json" as const) {
    this.model = model;
    this.url = url;
    this.transferType = transferType;
  }
  abstract sendData(content: unknown): unknown;
  abstract sendChatData(
    data: GPTChatCompletionInput,
  ): GPTChatCompletionOutput | Promise<GPTChatCompletionOutput>;
}
