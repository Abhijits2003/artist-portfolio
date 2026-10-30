
const fs = require('fs');

const png = (b) =>
  b.length > 24 && b.toString('ascii', 1, 4) === 'PNG' ? { width: b.readUInt32BE(16), height: b.readUInt32BE(20) } : null;

const jpeg = (b) => {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let o = 2;
  while (o + 9 < b.length) {
    if (b[o] !== 0xff) { o += 1; continue; }
    let m = b[o + 1];
    while (m === 0xff) { o += 1; m = b[o + 1]; }
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { o += 2; continue; }
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { height: b.readUInt16BE(o + 5), width: b.readUInt16BE(o + 7) };
    }
    o += 2 + b.readUInt16BE(o + 2);
  }
  return null;
};

const webp = (b) => {
  if (b.length < 30 || b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
  const t = b.toString('ascii', 12, 16);
  if (t === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (t === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (t === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  return null;
};

module.exports = (file) => {
  try {
    const b = fs.readFileSync(file);
    const d = png(b) || jpeg(b) || webp(b);
    return d && d.width && d.height ? d : null;
  } catch {
    return null;
  }
};
