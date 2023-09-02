/**
 * 通义千问的类型文件
 * 状态码查询：https://help.aliyun.com/zh/dashscope/response-status-codes
 */
export interface TongYiInput {
  /**
   * 指明需要调用的模型，目前可选 qwen-7b-v1 和 qwen-7b-chat-v1
   */
  model: string;
  input: {
    /**
     * 用户当前输入的期望模型执行指令，支持中英文。qwen-7b-v1 prompt字段支持 1.5k Tokens 长度；qwen-7b-chat-v1 prompt字段支持 6.5k Tokens 长度
     */
    prompt: string;
    /**
     * 用户与模型的对话历史，list中的每个元素是形式为{"user":"用户输入","bot":"模型输出"}的一轮对话，多轮对话按时间正序排列。（仅qwen-7b-chat-v1支持该参数，qwen-7b-v1不支持）
     */
    history?: Array<InputHistory>;
  };
  parameters?: {
    /**
     * 核采样方法的概率阈值。取值越低，生成的随机性越低。默认值 0.8。注意，取值不要大于等于1
     * default: 0.8
     */
    top_p?: number;
    /**
     * 生成时，采样候选集的大小。取值越大，生成的随机性越高；取值越小，生成的确定性越高。注意：如果top_k的值大于100，top_k将采用默认值100
     * default: 100
     */
    top_k?: number;
    seed?: number;
  };
}
interface InputHistory {
  user: string;
  bot: string;
}
export interface TongYiOutput {
  /**
   * 200（HTTPStatus.OK）表示请求成功，否则表示请求失败，可以通过code获取错误码，通过message字段获取错误详细信息。
   */
  status_code: number;
  /**
   * 系统生成的标志本次调用的id。
   */
  request_id: string;
  /**
   * 表示请求失败，表示错误码，成功忽略。
   */
  code: string;
  /**
   * 失败，表示失败详细信息，成功忽略。
   */
  message: string;
  output: {
    /**
     * 模型生成回复。
     */
    text: string;
    /**
     * 	有三种情况：正在生成时为null，生成结束时如果由于停止token导致则为stop，生成结束时如果因为生成长度过长导致则为length。
     */
    finish_reason: 'stop' | null | 'length';
  };
  usage: {
    /**
     * 模型生成回复转换为Token后的长度。
     */
    output_tokens: number;
    /**
     * 用户输入文本转换成Token后的长度。
     */
    input_tokens: number;
  };
}
