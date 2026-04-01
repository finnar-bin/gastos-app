function rotateLeft(value: number, shift: number) {
  return (value << shift) | (value >>> (32 - shift));
}

function toWordArray(input: string) {
  const messageLength = input.length;
  const wordCount = (((messageLength + 8) >> 6) + 1) * 16;
  const words = new Array<number>(wordCount).fill(0);

  for (let index = 0; index < messageLength; index += 1) {
    words[index >> 2] |= input.charCodeAt(index) << ((index % 4) * 8);
  }

  words[messageLength >> 2] |= 0x80 << ((messageLength % 4) * 8);
  words[wordCount - 2] = messageLength * 8;

  return words;
}

function toHex(value: number) {
  let output = "";

  for (let index = 0; index < 4; index += 1) {
    const byte = (value >> (index * 8)) & 0xff;
    output += byte.toString(16).padStart(2, "0");
  }

  return output;
}

function addUnsigned(x: number, y: number) {
  return (x + y) >>> 0;
}

function f(x: number, y: number, z: number) {
  return (x & y) | (~x & z);
}

function g(x: number, y: number, z: number) {
  return (x & z) | (y & ~z);
}

function h(x: number, y: number, z: number) {
  return x ^ y ^ z;
}

function i(x: number, y: number, z: number) {
  return y ^ (x | ~z);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, f(b, c, d)), addUnsigned(x, ac)), s), b);
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, g(b, c, d)), addUnsigned(x, ac)), s), b);
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, h(b, c, d)), addUnsigned(x, ac)), s), b);
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, i(b, c, d)), addUnsigned(x, ac)), s), b);
}

export function md5(input: string) {
  const words = toWordArray(input);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let index = 0; index < words.length; index += 16) {
    const originalA = a;
    const originalB = b;
    const originalC = c;
    const originalD = d;

    a = ff(a, b, c, d, words[index], 7, 0xd76aa478);
    d = ff(d, a, b, c, words[index + 1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, words[index + 2], 17, 0x242070db);
    b = ff(b, c, d, a, words[index + 3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, words[index + 4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, words[index + 5], 12, 0x4787c62a);
    c = ff(c, d, a, b, words[index + 6], 17, 0xa8304613);
    b = ff(b, c, d, a, words[index + 7], 22, 0xfd469501);
    a = ff(a, b, c, d, words[index + 8], 7, 0x698098d8);
    d = ff(d, a, b, c, words[index + 9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, words[index + 10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, words[index + 11], 22, 0x895cd7be);
    a = ff(a, b, c, d, words[index + 12], 7, 0x6b901122);
    d = ff(d, a, b, c, words[index + 13], 12, 0xfd987193);
    c = ff(c, d, a, b, words[index + 14], 17, 0xa679438e);
    b = ff(b, c, d, a, words[index + 15], 22, 0x49b40821);

    a = gg(a, b, c, d, words[index + 1], 5, 0xf61e2562);
    d = gg(d, a, b, c, words[index + 6], 9, 0xc040b340);
    c = gg(c, d, a, b, words[index + 11], 14, 0x265e5a51);
    b = gg(b, c, d, a, words[index], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, words[index + 5], 5, 0xd62f105d);
    d = gg(d, a, b, c, words[index + 10], 9, 0x02441453);
    c = gg(c, d, a, b, words[index + 15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, words[index + 4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, words[index + 9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, words[index + 14], 9, 0xc33707d6);
    c = gg(c, d, a, b, words[index + 3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, words[index + 8], 20, 0x455a14ed);
    a = gg(a, b, c, d, words[index + 13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, words[index + 2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, words[index + 7], 14, 0x676f02d9);
    b = gg(b, c, d, a, words[index + 12], 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, words[index + 5], 4, 0xfffa3942);
    d = hh(d, a, b, c, words[index + 8], 11, 0x8771f681);
    c = hh(c, d, a, b, words[index + 11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, words[index + 14], 23, 0xfde5380c);
    a = hh(a, b, c, d, words[index + 1], 4, 0xa4beea44);
    d = hh(d, a, b, c, words[index + 4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, words[index + 7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, words[index + 10], 23, 0xbebfbc70);
    a = hh(a, b, c, d, words[index + 13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, words[index], 11, 0xeaa127fa);
    c = hh(c, d, a, b, words[index + 3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, words[index + 6], 23, 0x04881d05);
    a = hh(a, b, c, d, words[index + 9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, words[index + 12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, words[index + 15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, words[index + 2], 23, 0xc4ac5665);

    a = ii(a, b, c, d, words[index], 6, 0xf4292244);
    d = ii(d, a, b, c, words[index + 7], 10, 0x432aff97);
    c = ii(c, d, a, b, words[index + 14], 15, 0xab9423a7);
    b = ii(b, c, d, a, words[index + 5], 21, 0xfc93a039);
    a = ii(a, b, c, d, words[index + 12], 6, 0x655b59c3);
    d = ii(d, a, b, c, words[index + 3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, words[index + 10], 15, 0xffeff47d);
    b = ii(b, c, d, a, words[index + 1], 21, 0x85845dd1);
    a = ii(a, b, c, d, words[index + 8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, words[index + 15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, words[index + 6], 15, 0xa3014314);
    b = ii(b, c, d, a, words[index + 13], 21, 0x4e0811a1);
    a = ii(a, b, c, d, words[index + 4], 6, 0xf7537e82);
    d = ii(d, a, b, c, words[index + 11], 10, 0xbd3af235);
    c = ii(c, d, a, b, words[index + 2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, words[index + 9], 21, 0xeb86d391);

    a = addUnsigned(a, originalA);
    b = addUnsigned(b, originalB);
    c = addUnsigned(c, originalC);
    d = addUnsigned(d, originalD);
  }

  return `${toHex(a)}${toHex(b)}${toHex(c)}${toHex(d)}`;
}
