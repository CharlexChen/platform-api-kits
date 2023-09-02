import { getEnvConfig } from './env';

export const TongYi_secret = getEnvConfig('TONGYI_SECRET');

export const generateTongYiUrl = () => {
  return 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
};
