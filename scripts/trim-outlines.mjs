// One-off asset prep: the pose-outline PNGs ship on a 1536×1024 canvas with the
// figure floating in a large transparent margin, so `object-fit: contain` renders
// them small. This trims each figure to its bounding box and re-pads it with a
// small uniform margin, so the Capture overlay can show a near-full-height guide
// without clipping wide poses (e.g. Warrior II's outstretched arms).
//
// Source of truth stays in design-system/assets/; this rewrites the app copies
// under public/assets/. Re-runnable (trims from the design-system originals).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const poses = ['tree', 'warrior', 'chair'];
const PAD_RATIO = 0.06; // 6% breathing room around the trimmed figure

for (const pose of poses) {
  const src = join(root, 'design-system/assets', `outline-${pose}.png`);
  const out = join(root, 'public/assets', `outline-${pose}.png`);

  // Trim fully-transparent borders (threshold tolerates the very faint cream line).
  const trimmed = await sharp(src).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const padX = Math.round(meta.width * PAD_RATIO);
  const padY = Math.round(meta.height * PAD_RATIO);

  await sharp(trimmed)
    .extend({ top: padY, bottom: padY, left: padX, right: padX, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(out);

  const final = await sharp(out).metadata();
  console.log(`outline-${pose}: 1536x1024 -> trimmed ${meta.width}x${meta.height} -> padded ${final.width}x${final.height}`);
}
