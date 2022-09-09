import sharp from 'sharp';

const [foo, bar, h, x, y] = process.argv.slice(2);

const mask = `
<svg width="22" height="44" viewBox="0 0 22 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 2H18C9.16344 2 2 9.16345 2 18V26C2 34.8366 9.16345 42 18 42H22V44H18C8.05888 44 0 35.9411 0 26V18C0 8.05888 8.05888 0 18 0H22V2Z" fill="red"/>
</svg>


`;

const svg = `
<svg viewBox="-10 -8 ${foo * bar.length} ${h + 8}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
    text {
      -webkit-font-smoothing:antialiased;
      font-family: 'Inconsolata', sans-serif;
      font-weight: 600;
      color: red;
    }
    </style>
  </defs>
  <text x="${x}" y="${y}" text-anchor="start" font-size="40">${bar}</text>
</svg>
`;

async function run() {
  const i = await sharp(Buffer.from(svg))
    .composite([{ input: Buffer.from(mask), gravity: 'northwest' }])
    .png()
    .toFile('./dist/img.png');
}

run();
