import {
  GPTChatCompletionInput,
  GPTChatCompletionOutput,
} from "../interface/gpt-chat-completion";

export abstract class GptChatBase {
  protected model: string;
  protected url: string;
  protected transferType: "http-json" | "websocket" | "http-sse";
  protected responseRaw?: string;
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
