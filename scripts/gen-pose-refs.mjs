// One-off asset prep for the v2 Capture reference card: the pose-*.png cutouts
// have transparent margins around the figure, so shown small they look tiny. This
// trims each to the figure's bounding box and re-pads a little, producing
// pose-*-ref.png that fills the reference card for every pose (tall or wide) with
// object-fit: contain and no cropping. Leaves the originals (used by Choose Pose)
// untouched. Re-runnable.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const poses = ['tree', 'warrior', 'chair'];
const PAD_RATIO = 0.04;

for (const pose of poses) {
  const src = join(root, 'public/assets', `pose-${pose}.png`);
  const out = join(root, 'public/assets', `pose-${pose}-ref.png`);

  const trimmed = await sharp(src).trim({ threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const padX = Math.round(meta.width * PAD_RATIO);
  const padY = Math.round(meta.height * PAD_RATIO);

  await sharp(trimmed)
    .extend({ top: padY, bottom: padY, left: padX, right: padX, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(out);

  const final = await sharp(out).metadata();
  console.log(`pose-${pose}: trimmed to ${meta.width}x${meta.height} -> padded ${final.width}x${final.height}`);
}
