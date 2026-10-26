/**
 * Renders every shoe image with its code and name onto contact sheets, to spot wrong matches.
 * Output: docs/contact-sheet-<n>.jpg (git-ignored)
 *
 * Run: node scripts/contact-sheet.ts
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import type { Shoe } from '../src/types/shoe.ts'

const CATALOG = new URL('../public/data/catalog.json', import.meta.url)
const IMAGES = new URL('../public/images/shoes/', import.meta.url)
const OUT = new URL('../docs/', import.meta.url)
const COLUMNS = 5
const PER_SHEET = 20
const TILE_W = 400
const IMAGE_H = 280
const LABEL_H = 56

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function label(index: number, shoe: Shoe): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${LABEL_H}">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="12" y="22" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">${index}. ${shoe.id}</text>
    <text x="12" y="44" font-family="Arial" font-size="16" fill="#bbb">${escapeXml(`${shoe.model} · ${shoe.name}`)}</text>
  </svg>`
  return Buffer.from(svg)
}

async function main(): Promise<void> {
  const catalog: Shoe[] = JSON.parse(await readFile(CATALOG, 'utf8'))
  const tileH = IMAGE_H + LABEL_H

  for (let start = 0; start < catalog.length; start += PER_SHEET) {
    const shoes = catalog.slice(start, start + PER_SHEET)
    const rows = Math.ceil(shoes.length / COLUMNS)
    const layers: sharp.OverlayOptions[] = []

    for (const [i, shoe] of shoes.entries()) {
      const left = (i % COLUMNS) * TILE_W
      const top = Math.floor(i / COLUMNS) * tileH
      const image = await sharp(fileURLToPath(new URL(`${shoe.id}.webp`, IMAGES)))
        .resize(TILE_W, IMAGE_H)
        .toBuffer()
      layers.push({ input: image, left, top })
      layers.push({ input: label(start + i + 1, shoe), left, top: top + IMAGE_H })
    }

    const file = new URL(`contact-sheet-${start / PER_SHEET + 1}.jpg`, OUT)
    await sharp({
      create: { width: COLUMNS * TILE_W, height: rows * tileH, channels: 3, background: '#000' },
    })
      .composite(layers)
      .jpeg({ quality: 80 })
      .toFile(fileURLToPath(file))
    console.log(fileURLToPath(file))
  }
}

await main()
