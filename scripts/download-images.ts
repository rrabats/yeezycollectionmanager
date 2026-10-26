/**
 * Downloads the image for every shoe in scripts/image-sources.json and saves it as
 * public/images/shoes/<ID>.webp: white borders trimmed, centred on a white 800x560 canvas.
 *
 * Run: node scripts/download-images.ts          (skips images that already exist)
 *      node scripts/download-images.ts --force  (re-downloads everything)
 */
import { access, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SOURCES = new URL('./image-sources.json', import.meta.url)
const OUT_DIR = new URL('../public/images/shoes/', import.meta.url)
const WIDTH = 800
const HEIGHT = 560
const PADDING = 40
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }
const PARALLEL = 4

const force = process.argv.includes('--force')

async function exists(file: URL): Promise<boolean> {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function download(id: string, url: string): Promise<void> {
  const target = new URL(`${id}.webp`, OUT_DIR)
  if (!force && (await exists(target))) return

  const res = await fetch(`${url}?fit=fill&bg=FFFFFF&w=1400&h=1000&fm=png`)
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  const input = Buffer.from(await res.arrayBuffer())

  const trimmed = await sharp(input).flatten({ background: WHITE }).trim({ threshold: 12 }).toBuffer()
  await sharp(trimmed)
    .resize(WIDTH - PADDING * 2, HEIGHT - PADDING * 2, { fit: 'contain', background: WHITE })
    .extend({ top: PADDING, bottom: PADDING, left: PADDING, right: PADDING, background: WHITE })
    .webp({ quality: 82 })
    .toFile(fileURLToPath(target))
}

async function main(): Promise<void> {
  const sources: Record<string, string> = JSON.parse(await readFile(SOURCES, 'utf8'))
  await mkdir(OUT_DIR, { recursive: true })

  const entries = Object.entries(sources)
  const failed: string[] = []
  for (let i = 0; i < entries.length; i += PARALLEL) {
    await Promise.all(
      entries.slice(i, i + PARALLEL).map(async ([id, url]) => {
        try {
          await download(id, url)
          console.log(`ok     ${id}`)
        } catch (err) {
          failed.push(id)
          console.log(`FAILED ${id} ${(err as Error).message}`)
        }
      }),
    )
  }
  console.log(`\n${entries.length - failed.length}/${entries.length} saved`)
}

await main()
