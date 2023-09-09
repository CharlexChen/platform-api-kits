import axios from 'axios';
import { GptChatBase } from '../abstract/gpt-chat-base';
import {
  GPTChatCompletionInput,
  GPTChatCompletionOutput,
} from '../interface/gpt-chat-completion';
import { TongYiInput, TongYiOutput } from '../interface/tongyi';
import { TongYi_secret, generateTongYiUrl } from '../utils/tongyi-kit';

const label = '[tongyi.service]';

export class TongYiService extends GptChatBase {
  constructor() {
    super('tongyi');
  }
  /**
   * [tongyi] generate url
   * @returns 
   */
  generateUrl() {
    return generateTongYiUrl();
  }
  /**
   * 【tongyi】send chat data
   * according for the docs of tongyi
   * @param content 
   * @returns 
   */
  async sendData(content: TongYiInput) {
    // http request
    const url = this.generateUrl();
    const result = await axios.post(url, content, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${TongYi_secret}`,
      },
    });
    return result.data as unknown as TongYiOutput;
  }
  async sendChatData(
    data: GPTChatCompletionInput,
  ): Promise<GPTChatCompletionOutput> {
    const [latest, ...otherList] = data.messages;
    const historyList: { user: string; bot: string; }[] = [];
    let obj = {
      user: '',
      bot: '',
    };
    let curRole = '';
    otherList.forEach((ele) => {
      if (ele.role != 'user') {
        if (curRole == ele.role) {
          historyList.push({ ...obj });
          obj = {
            user: '',
            bot: '',
          };
        } else {
          obj.bot = ele.content as string;
          curRole = ele.role;
        }
      } else {
        if (curRole == ele.role) {
          historyList.push({ ...obj });
          obj = {
            user: '',
            bot: '',
          };
        } else {
          obj.user = ele.content as string;
          curRole = ele.role;
        }
      }
      if (obj.user && obj.bot) {
        historyList.push({ ...obj });
        obj = {
          user: '',
          bot: '',
        };
      }
    });
    const result = await this.sendData({
      model: data.model || 'qwen-7b-chat-v1', //
      input: {
        prompt: latest.content as string,
        history: historyList.reverse(),
      },
    });
    console.log(label, 'sendChatData', result);
    return {
      id: result.request_id,
      choices: [
        {
          finish_reason: 'stop',
          index: 0,
          message: {
            content: result.output.text,
            role: 'assistant',
          },
        },
      ],
      created: Date.now(),
      model: data.model,
      usage: {
        completion_tokens: result.usage.output_tokens,
        prompt_tokens: result.usage.input_tokens,
        total_tokens: result.usage.output_tokens + result.usage.input_tokens,
      },
    };
    // {
    //   "model": "qwen-v1",
    //   "input":{
    //       "prompt":"哪个公园距离我最近",
    //       "history":[
    //           {
    //               "user":"今天天气好吗？",
    //               "bot":"今天天气不错，要出去玩玩嘛？"
    //           },
    //           {
    //               "user":"那你有什么地方推荐？",
    //               "bot":"我建议你去公园，春天来了，花朵开了，很美丽。"
    //           }
    //       ]
    //   },
    //   "parameters": {
    //     top_p: 0.8,
    //     top_k: 50,
    //     seed: 1,
    //   }
    // }
  }
}
