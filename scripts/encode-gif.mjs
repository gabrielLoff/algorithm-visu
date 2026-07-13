import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';

const frameDir = 'public/demo-frames';
const files = readdirSync(frameDir).filter(f => f.endsWith('.png')).sort();

const sampled = files.filter((_, i) => i % 3 === 0);

const firstPng = PNG.sync.read(readFileSync(join(frameDir, sampled[0])));
const scale = 0.55;
const outW = Math.floor(firstPng.width * scale);
const outH = Math.floor(firstPng.height * scale);

const encoder = new GIFEncoder(outW, outH, 'neuquant', true);
encoder.setDelay(100);
encoder.setRepeat(0);
encoder.setQuality(15);
encoder.start();

for (const file of sampled) {
  const raw = PNG.sync.read(readFileSync(join(frameDir, file)));
  const scaled = new PNG({ width: outW, height: outH });
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const sx = Math.floor(x / scale);
      const sy = Math.floor(y / scale);
      const srcIdx = (raw.width * sy + sx) << 2;
      const dstIdx = (outW * y + x) << 2;
      scaled.data[dstIdx] = raw.data[srcIdx];
      scaled.data[dstIdx + 1] = raw.data[srcIdx + 1];
      scaled.data[dstIdx + 2] = raw.data[srcIdx + 2];
      scaled.data[dstIdx + 3] = raw.data[srcIdx + 3];
    }
  }
  encoder.addFrame(scaled.data);
}

encoder.finish();
const buf = encoder.out.getData();
writeFileSync('public/demo.gif', buf);
console.log(`Created public/demo.gif (${(buf.length / 1024).toFixed(0)} KB)`);
