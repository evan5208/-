#!/usr/bin/env zx

import "zx/globals";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ICON_SOURCE = path.join(PROJECT_ROOT, "resources", "icons", "icon-source.png");
const OUT_DIR = path.join(PROJECT_ROOT, "resources", "installer");

const WIDTH = 164;
const HEIGHT = 314;

if (!fs.existsSync(ICON_SOURCE)) {
  echo(chalk.red(`❌ Installer art source not found: ${ICON_SOURCE}`));
  process.exit(1);
}

await fs.ensureDir(OUT_DIR);

function createOverlaySvg({
  title,
  subtitle,
  accentStart,
  accentEnd,
  cardFill,
  cardStroke,
}) {
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2f0a05"/>
          <stop offset="52%" stop-color="#1d0604"/>
          <stop offset="100%" stop-color="#110303"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="32%" r="54%">
          <stop offset="0%" stop-color="#ffcf70" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="#ff8a28" stop-opacity="0.34"/>
          <stop offset="100%" stop-color="#ff8a28" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accentStart}"/>
          <stop offset="100%" stop-color="${accentEnd}"/>
        </linearGradient>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <ellipse cx="82" cy="88" rx="78" ry="72" fill="url(#glow)"/>

      <rect x="14" y="18" width="136" height="136" rx="30" fill="${cardFill}" stroke="${cardStroke}" stroke-width="1.5"/>
      <rect x="26" y="176" width="112" height="4" rx="2" fill="url(#accent)" opacity="0.95"/>

      <circle cx="31" cy="29" r="2.6" fill="#ffd98d" opacity="0.9"/>
      <circle cx="132" cy="38" r="2.2" fill="#ffb247" opacity="0.85"/>
      <circle cx="145" cy="170" r="2.8" fill="#ff9f30" opacity="0.55"/>

      <text
        x="82"
        y="223"
        text-anchor="middle"
        fill="#fff4d8"
        font-size="24"
        font-weight="800"
        letter-spacing="1"
        font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, sans-serif"
      >${title}</text>

      <text
        x="82"
        y="250"
        text-anchor="middle"
        fill="#ffd08d"
        font-size="11"
        font-weight="600"
        letter-spacing="0.6"
        font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, sans-serif"
      >${subtitle}</text>

      <text
        x="82"
        y="286"
        text-anchor="middle"
        fill="#ffb76b"
        font-size="10"
        font-weight="700"
        letter-spacing="2"
        font-family="Avenir Next, Helvetica Neue, Arial, sans-serif"
      >STEAD</text>
    </svg>
  `);
}

async function createPanel({ baseName, title, subtitle, accentStart, accentEnd }) {
  const pngPath = path.join(OUT_DIR, `${baseName}.png`);
  const bmpPath = path.join(OUT_DIR, `${baseName}.bmp`);

  const overlaySvg = createOverlaySvg({
    title,
    subtitle,
    accentStart,
    accentEnd,
    cardFill: "rgba(103, 28, 12, 0.58)",
    cardStroke: "rgba(255, 199, 117, 0.35)",
  });

  const mascot = await sharp(ICON_SOURCE)
    .resize(112, 112, { fit: "cover" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#140403",
    },
  })
    .composite([
      { input: overlaySvg },
      { input: mascot, top: 29, left: 26 },
    ])
    .png()
    .toFile(pngPath);

  await $`sips -s format bmp ${pngPath} --out ${bmpPath}`.quiet();
  echo(`  ✅ Created ${path.basename(bmpPath)}`);
}

echo("🎨 Generating Windows installer sidebars...");

await createPanel({
  baseName: "installer-sidebar",
  title: "老驴",
  subtitle: "把活跑起来",
  accentStart: "#ffd36e",
  accentEnd: "#ff7f1f",
});

await createPanel({
  baseName: "uninstaller-sidebar",
  title: "老驴",
  subtitle: "轻松收尾，再次出发",
  accentStart: "#ffe29a",
  accentEnd: "#ff9447",
});

echo(`✨ Installer artwork complete: ${OUT_DIR}`);
