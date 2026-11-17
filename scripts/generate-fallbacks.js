import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../frontend/public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate SVG Avatar
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3F0071" />
      <stop offset="50%" stop-color="#332FD0" />
      <stop offset="100%" stop-color="#FB2576" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="64" fill="url(#avatarGrad)" />
  <!-- Avatar Silhouette -->
  <circle cx="64" cy="46" r="22" fill="#FFFFFF" fill-opacity="0.92" />
  <path d="M26 106 C26 84 43 74 64 74 C85 74 102 84 102 106 Z" fill="#FFFFFF" fill-opacity="0.92" />
</svg>`;
fs.writeFileSync(path.join(publicDir, "default-avatar.svg"), avatarSvg, "utf8");

// 2. Generate SVG Blog Placeholder
const blogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0002A1" />
      <stop offset="50%" stop-color="#3F0071" />
      <stop offset="100%" stop-color="#332FD0" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB2576" />
      <stop offset="100%" stop-color="#332FD0" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bgGrad)" />
  <g transform="translate(350, 150)">
    <rect width="100" height="75" rx="14" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.3)" stroke-width="2" />
    <circle cx="30" cy="25" r="9" fill="#FB2576" />
    <path d="M15 65 L40 38 L65 52 L85 30 L95 65 Z" fill="rgba(255, 255, 255, 0.4)" />
  </g>
  <text x="400" y="275" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.85" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" letter-spacing="1">DedicatedBlog</text>
  <text x="400" y="305" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="system-ui, -apple-system, sans-serif" font-size="14">Cover Image Unavailable</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, "imgPL.svg"), blogSvg, "utf8");

// Helper to write valid PNG
function createRGBA_PNG(width, height, pixelFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    return (crc ^ -1) >>> 0;
  }
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((1 + width * 4) * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const px = rowOffset + 1 + x * 4;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
      raw[px + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(raw);
  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", idatData),
    makeChunk("IEND", Buffer.alloc(0))
  ]);
}

// Generate default-avatar.png (128x128 circle avatar)
const avatarPng = createRGBA_PNG(128, 128, (x, y, w, h) => {
  const cx = 64, cy = 64;
  const dist = Math.hypot(x - cx, y - cy);
  if (dist > 63) return [0, 0, 0, 0];
  const t = (x + y) / (w + h);
  const r = Math.round(63 * (1 - t) + 51 * t);
  const g = Math.round(0 * (1 - t) + 47 * t);
  const b = Math.round(113 * (1 - t) + 208 * t);
  
  const headDist = Math.hypot(x - 64, y - 46);
  if (headDist < 20) return [255, 255, 255, 235];

  if (y > 70) {
    const bodyW = 18 + (y - 70) * 1.3;
    if (Math.abs(x - 64) < bodyW && y < 110) return [255, 255, 255, 235];
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(publicDir, "default-avatar.png"), avatarPng);

// Generate imgPL.png & imgPL.webp (400x225 placeholder)
const blogPng = createRGBA_PNG(400, 225, (x, y, w, h) => {
  const t = (x + y) / (w + h);
  const r = Math.round(0 * (1 - t) + 63 * t);
  const g = Math.round(2 * (1 - t) + 0 * t);
  const b = Math.round(161 * (1 - t) + 113 * t);
  return [r, g, b, 255];
});
fs.writeFileSync(path.join(publicDir, "imgPL.png"), blogPng);
fs.writeFileSync(path.join(publicDir, "imgPL.webp"), blogPng);

console.log("Successfully generated public fallback assets:", fs.readdirSync(publicDir));
