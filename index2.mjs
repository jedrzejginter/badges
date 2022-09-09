import sharp from 'sharp';

const [text, color, mode = 'outline', rawScale = 1] = process.argv.slice(2);

const bg = mode === 'bg';
const SCALE = Number(rawScale);

const pillLeft = bg
  ? `
<svg width="${SCALE * 16}" height="${
      SCALE * 24
    }" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 0H12C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24H16V0Z" fill="${color}"/>
</svg>
`
  : `
<svg width="${SCALE * 16}" height="${
      SCALE * 24
    }" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 0H16V1H12C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23H16V24H12C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0Z" fill="${color}"/>
</svg>
`;

const pillRight = bg
  ? `
<svg width="${SCALE * 16}" height="${
      SCALE * 24
    }" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 24H4C10.6274 24 16 18.6274 16 12C16 5.37258 10.6274 0 4 0H0V24Z" fill="${color}"/>
</svg>
`
  : `
<svg width="${SCALE * 16}" height="${
      SCALE * 24
    }" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 24L0 24V23L4 23C10.0751 23 15 18.0751 15 12C15 5.92487 10.0751 1 4 1L0 1V0L4 0C10.6274 0 16 5.37258 16 12C16 18.6274 10.6274 24 4 24Z" fill="${color}"/>
</svg>
`;

const rect = (w, h) =>
  bg
    ? `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="0" width="100%" height="${h}" fill="${color}"/>
</svg>
`
    : `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="0" width="${w}" height="${SCALE * 1}" fill="${color}"/>
<rect x="0" y="${h - SCALE * 1}" width="${w}" height="${SCALE * 1}" fill="${color}"/>
</svg>
`;

const svg = (w, h) => `
<svg width="${SCALE * w}" height="${
  SCALE * h
}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
    text {
      font-family: sans-serif;
      fill: ${bg ? '#fff' : color};
      alignment-baseline: top;
      dominant-baseline: top;
      text-anchor: start;
      font-size: 12px;
      font-weight: bold;
    }
    </style>
  </defs>
  <text x="0" y="40">${text}</text>
</svg>
`;

const emptySvg = (w, h) => `
<svg width="${SCALE * w}" height="${
  SCALE * h
}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">

</svg>
`;

async function run() {
  const k = await sharp(Buffer.from(svg(800, 80)))
    .trim()
    .toBuffer();

  const j = await sharp(k).metadata();
  const j2 = await sharp(Buffer.from(pillLeft)).metadata();

  console.log('text', j.width, j.height);
  console.log('pill', j2.width, j2.height);

  console.log(/[qypgj]/.test(text));

  const PAD_X = 12;

  const i = await sharp(Buffer.from(emptySvg(1000, 100)))
    .composite([
      {
        input: Buffer.from(pillLeft),
        top: 0,
        left: 0,
      },
      {
        input: Buffer.from(pillRight),
        top: 0,
        left: SCALE * 8 + j.width,
      },
      {
        input: Buffer.from(rect(j.width - SCALE * 8, j2.height)),
        top: 0,
        left: SCALE * 16,
      },
      {
        input: k,
        top: SCALE * 7,
        left: SCALE * PAD_X,
      },
    ])
    .extract({
      left: 0,
      top: 0,
      height: SCALE * 24,
      width: SCALE * (j.width + 24),
    })
    .png()
    .toFile('./dist/img2.png');
}

run();
