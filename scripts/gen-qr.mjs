// One-off asset prep: generate a dummy QR code PNG for the Score screen.
// Until the (deferred) backend hosts each photo and returns a real short URL,
// this is a placeholder QR that encodes a demo link. Re-runnable.
import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/assets', 'qr-dummy.png');

// Placeholder target — swap for the real per-photo download URL once the backend exists.
const DEMO_URL = 'https://movelab.example/photo/demo';

await QRCode.toFile(out, DEMO_URL, {
  margin: 1,
  width: 480,
  color: { dark: '#111111', light: '#00000000' }, // ink modules on a transparent background
});

console.log(`wrote ${out} (encodes ${DEMO_URL})`);
