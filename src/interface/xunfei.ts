import { CreateChatCompletionRequestMessage } from './gpt-chat-completion';

export interface XunFeiInput {
  header: {
    /**
     * 应用appid，从开放平台控制台创建的应用中获取
     */
    app_id: string;
    /**
     * 每个用户的id，用于区分不同用户(最大长度32)
     */
    uid?: string;
  };
  parameter: {
    chat: {
      /**
       * 指定访问的领域,general指向V1.5版本 generalv2指向V2版本。注意：不同的取值对应的url也不一样！
       */
      domain: string;
      /**
       * 核采样阈值。用于决定结果随机性，取值越高随机性越强即相同的问题得到的不同答案的可能性越高（取值为[0,1],默认为0.5）
       */
      temperature?: number;
      /**
       * 模型回答的tokens的最大长度（取值为[1,4096]，默认为2048）
       */
      max_tokens?: number;
      /**
       * 从k个候选中随机选择⼀个（⾮等概率）（取值为[1，6],默认为4）
       */
      top_k?: number;
      /**
       * 用于关联用户会话（需要保障用户下的唯一性）
       */
      chat_id?: string;
    };
  };
  payload: {
    message: {
      text: Array<CreateChatCompletionRequestMessage>;
    };
  };
}
export interface XunFeiOutput {
  header: {
    /**
     * 错误码，0表示正常，非0表示出错；详细释义可在接口说明文档最后的错误码说明了解
     */
    code: number;
    /**
     * 会话是否成功的描述信息
     */
    message: string;
    /**
     * 会话的唯一id，用于讯飞技术人员查询服务端会话日志使用,出现调用错误时建议留存该字段
     */
    sid: string;
    /**
     * 会话状态，取值为[0,1,2]；0代表首次结果；1代表中间结果；2代表最后一个结果
     */
    status: number;
  };
  payload: {
    choices: {
      /**
       * 文本响应状态，取值为[0,1,2]; 0代表首个文本结果；1代表中间文本结果；2代表最后一个文本结果
       */
      status: number;
      /**
       * 返回的数据序号，取值为[0,9999999]
       */
      seq: number;
      text: Array<
        CreateChatCompletionRequestMessage & {
          /**
           * 结果序号，取值为[0,10]; 当前为保留字段，开发者可忽略
           */
          index: number;
        }
      >;
    };
    usage: {
      text: {
        /**
         * 保留字段，可忽略
         */
        question_tokens: number;
        /**
         * 包含历史问题的总tokens大小
         */
        prompt_tokens: number;
        /**
         * 回答的tokens大小
         */
        completion_tokens: number;
        /**
         * prompt_tokens和completion_tokens的和，也是本次交互计费的tokens大小
         */
        total_tokens: number;
      };
    };
  };
}
