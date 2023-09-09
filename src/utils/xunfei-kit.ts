import { encodeToBase64, encryptBySecret, formatGMTDate } from './common';
import * as CryptoJS from 'crypto-js';
import { getEnvConfig } from './env';
export const XunFei_APIAppid = getEnvConfig('XUNFEI_APPID');
const XunFei_APIKey = getEnvConfig('XUNFEI_APIKEY');
const XunFei_APISecret = getEnvConfig('XUNFEI_APISECRET');
export const XunFei_version = 'v2.1';
export const XunFei_domain = 'generalv2';
let dateStr = '';

// let apiKey = API_KEY
// let apiSecret = API_SECRET
// let url = 'wss://spark-api.xf-yun.com/v1.1/chat'
// let host = location.host
// let date = new Date().toGMTString()
// let algorithm = 'hmac-sha256'
// let headers = 'host date request-line'
// let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
// let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
// let signature = CryptoJS.enc.Base64.stringify(signatureSha)
// let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
// let authorization = btoa(authorizationOrigin)
// url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

export function generateRequestInfo(host = 'spark-api.xf-yun.com', pathname = `/${XunFei_version}/chat`) {
  dateStr = formatGMTDate();
  return `host: ${host}\ndate: ${dateStr}\nGET ${pathname} HTTP/1.1`;
}

export function generateAuthorization(apiKey = XunFei_APIKey, apiSecret = XunFei_APISecret, host = 'spark-api.xf-yun.com', pathname = `/${XunFei_version}/chat`) {
  if (!apiKey || !apiSecret) {
    return null;
  }
  const info = generateRequestInfo(host, pathname);
  const encryptStr = encryptBySecret(info, apiSecret as string);
  const signature = CryptoJS.enc.Base64.stringify(encryptStr as never);
  const authorization_origin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization_result = encodeToBase64(authorization_origin);
  return authorization_result;
}

export function generateXunFeiUrl() {
  const params = {
    authorization: generateAuthorization(XunFei_APIKey, XunFei_APISecret),
    date: encodeURIComponent(dateStr).replace(/%20/g, '+'),
    host: 'spark-api.xf-yun.com',
  };
  const url = `wss://spark-api.xf-yun.com/${XunFei_version}/chat?authorization=${params.authorization}&date=${params.date}&host=${params.host}`;
  return url;
}

export function assembleWsAuthUrl(hostUrl: string, apiKey = XunFei_APIKey, apiSecret = XunFei_APISecret): string {
  const url = new URL(hostUrl);
  const hostname = url.hostname;
  const pathname = url.pathname;
  //拼接签名字符串
  const params = {
    authorization: generateAuthorization(apiKey, apiSecret, hostname, pathname),
    date: encodeURIComponent(dateStr).replace(/%20/g, '+'),
    host: hostname,
  };
  return `wss://${hostname}?authorization=${params.authorization}&date=${params.date}&host=${params.host}`;
}