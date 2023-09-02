import * as dotenv from 'dotenv';
dotenv.config();
export const getEnvConfig = (key: string) => {
  return process.env[key];
};
