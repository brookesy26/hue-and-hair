import { readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const images = {};
for (const category of ['hairstyles', 'colour', 'editorial'])
  for (const name of await readdir(`public/images/${category}`)) {
    if (!name.endsWith('.webp')) continue;
    const { width, height } = await sharp(
      `public/images/${category}/${name}`,
    ).metadata();
    images[`/images/${category}/${name}`] = { width, height };
  }
await writeFile(
  'src/content/image-metadata.json',
  JSON.stringify(images, null, 2) + '\n',
);
console.log(
  `Recorded natural dimensions for ${Object.keys(images).length} images.`,
);
