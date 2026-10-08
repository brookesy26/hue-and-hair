import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
const root = 'assets/originals';
let total = 0;
for (const category of ['hairstyles', 'colour', 'editorial']) {
  await mkdir(join('public/images', category), { recursive: true });
  for (const file of await readdir(join(root, category))) {
    if (!file.endsWith('.png')) continue;
    await sharp(join(root, category, file))
      .rotate()
      .resize({
        width: category === 'editorial' ? 1600 : 1024,
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(join('public/images', category, file.replace(/\.png$/, '.webp')));
    total++;
  }
}
console.log(`Optimised ${total} originals to WebP; originals retained.`);
