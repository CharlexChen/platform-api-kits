import { encodeToBase64, encryptBySecret, formatGMTDate } from './common';
import * as CryptoJS from 'crypto-js';
import { getEnvConfig } from './env';
export const XunFei_APIAppid = getEnvConfig('XUNFEI_APPID');
const XunFei_APIKey = getEnvConfig('XUNFEI_APIKEY');
const XunFei_APISecret = getEnvConfig('XUNFEI_APISECRET');
export const XunFei_version = 'v2.1';
export const XunFei_domain = 'generalv2';
let dateStr = '';

// var apiKey = API_KEY
// var apiSecret = API_SECRET
// var url = 'wss://spark-api.xf-yun.com/v1.1/chat'
// var host = location.host
// var date = new Date().toGMTString()
// var algorithm = 'hmac-sha256'
// var headers = 'host date request-line'
// var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
// var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
// var signature = CryptoJS.enc.Base64.stringify(signatureSha)
// var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
// var authorization = btoa(authorizationOrigin)
// url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

export function generateRequestInfo() {
  dateStr = formatGMTDate();
  // dateStr = new Date().toGMTString();
  return `host: spark-api.xf-yun.com\ndate: ${dateStr}\nGET /${XunFei_version}/chat HTTP/1.1`;
}

export function generateAuthorization() {
  const info = generateRequestInfo();
  const encryptStr = encryptBySecret(info, XunFei_APISecret as string);
  const signature = CryptoJS.enc.Base64.stringify(encryptStr as never);
  const authorization_origin = `api_key="${XunFei_APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization_result = encodeToBase64(authorization_origin);
  return authorization_result;
}

export function generateXunfeiUrl() {
  const params = {
    authorization: generateAuthorization(),
    date: encodeURIComponent(dateStr).replace(/%20/g, '+'),
    host: 'spark-api.xf-yun.com',
  };
  const url = `wss://spark-api.xf-yun.com/${XunFei_version}/chat?authorization=${params.authorization}&date=${params.date}&host=${params.host}`;
  return url;
}
