import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

export function formatGMTDate(date = new Date()) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = date.getUTCFullYear();
  const month = months[date.getUTCMonth()];
  const dat = date.getUTCDate().toString().padStart(2, '0');
  const day = days[date.getUTCDay()];
  const hour = date.getUTCHours().toString().padStart(2, '0');
  const minute = date.getUTCMinutes().toString().padStart(2, '0');
  const second = date.getUTCSeconds().toString().padStart(2, '0');
  return `${day}, ${dat} ${month} ${year} ${hour}:${minute}:${second} GMT`;
}

export function encodeToBase64(str: string) {
  const buffer = Buffer.from(str, 'utf-8');
  return buffer.toString('base64');
}

export function encryptBySecret(
  message: string,
  secret: string,
  type = 'sha256',
) {
  if (type == 'sha256') {
    return CryptoJS.HmacSHA256(message, secret);
  }
  const hmac = crypto.createHmac(type, secret);
  hmac.update(message);
  const hmacResult = hmac.digest('hex');
  return hmacResult;
}
