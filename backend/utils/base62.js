const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const encodeBase62 = (hash) => {
  let num = BigInt('0x' + hash.slice(0, 16)); // Use first 16 chars of hash
  let encoded = '';
  while (num > 0) {
    encoded = chars[Number(num % 62n)] + encoded;
    num = num / 62n;
  }
  return encoded || chars[0];
};

module.exports = { encodeBase62 };