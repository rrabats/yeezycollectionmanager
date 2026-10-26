/**
 * Finds a StockX product image for every shoe in the catalog by trying likely file names
 * on the public image CDN. Writes scripts/image-sources.json (id -> url).
 *
 * Run: node scripts/find-image-sources.ts
 * Existing entries in image-sources.json are kept, so manual fixes survive a re-run.
 */
import { readFile, writeFile } from 'node:fs/promises'
import type { Shoe } from '../src/types/shoe.ts'

const CDN = 'https://images.stockx.com/images/'
const CATALOG = new URL('../public/data/catalog.json', import.meta.url)
const SOURCES = new URL('./image-sources.json', import.meta.url)
const PARALLEL_SHOES = 4

// StockX titles that differ from the official colorway name. Some images use pre-release
// names (Eliada, Yecher, Pure Oat) or other file names; those were found by hand and are
// kept in image-sources.json, so re-runs leave them alone.
const ALIASES: Record<string, string[]> = {
  BB1826: ['Steeple-Grey-Beluga-Solar-Red', 'Beluga'],
  FU9007: ['Static-Black-Reflective'],
  H02795: ['Yecher', 'Fade'],
  FZ5240: ['Eliada', 'Sand-Taupe'],
  HQ6316: ['Pure-Oat', 'Bone'],
  BY1605: ['Core-Black-Copper'],
  BY9611: ['Core-Black-Green'],
  BY9612: ['Core-Black-Red'],
  BY1604: ['Core-Black-White', 'Oreo'],
  CP9652: ['Core-Black-Red-2017', 'Bred', 'Black-Red'],
  CP9366: ['Cream-White', 'Triple-White', 'Cream'],
  AH2203: ['Beluga-2pt0', 'Beluga-2-0', 'Beluga-2'],
  B37572: ['Semi-Frozen-Yellow'],
  FU9006: ['Black', 'Black-Non-Reflective'],
  EF2905: ['Static', 'Static-Non-Reflective'],
  FY5346: ['Sulfur', 'Sulphur'],
  FZ5000: ['Carbon', 'Asriel'],
  FZ5246: ['Natural', 'Abez'],
  HQ2060: ['Salt', 'Jade-Ash'],
  HP7870: ['Slate', 'Beige-Black', 'Slate-Core-Black-Slate'],
  ID4811: ['MX-Dark-Salt', 'Dark-Salt', 'MX-Grey'],
  GW3775: ['MX-Frost-Blue', 'MX-Frost', 'MX-Blue'],
  IG9608: ['Panda', 'Slate-White'],
  EG5293: ['Glow', 'Glow-in-the-Dark'],
}

const PREFIXES: Record<Shoe['model'], string[]> = {
  '350 V2': ['adidas-Yeezy-Boost-350-V2-', 'Adidas-Yeezy-Boost-350-V2-', 'adidas-Yeezy-350-V2-'],
  '350 V2 CMPCT': ['adidas-Yeezy-350-V2-CMPCT-', 'adidas-Yeezy-Boost-350-V2-CMPCT-'],
}

function nameVariants(shoe: Shoe): string[] {
  const base = shoe.name.replace(/\s+/g, '-')
  const variants = [...(ALIASES[shoe.id] ?? []), base]
  // "Antlia Non-Reflective" is often listed as just "Antlia"
  if (base.endsWith('-Non-Reflective')) variants.push(base.replace('-Non-Reflective', ''))
  return [...new Set(variants)]
}

function candidates(shoe: Shoe): string[] {
  const urls: string[] = []
  const suffixes = ['', `-${shoe.releaseYear}`]
  for (const suffix of suffixes) {
    for (const name of nameVariants(shoe)) {
      for (const prefix of PREFIXES[shoe.model]) {
        urls.push(`${CDN}${prefix}${name}${suffix}-Product.jpg`)
      }
    }
  }
  return urls
}

async function exists(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}?w=50`, { method: 'HEAD' })
    return res.ok && (res.headers.get('content-type') ?? '').startsWith('image/')
  } catch {
    return false
  }
}

async function findSource(shoe: Shoe): Promise<string | null> {
  for (const url of candidates(shoe)) {
    if (await exists(url)) return url
  }
  return null
}

async function main(): Promise<void> {
  const catalog: Shoe[] = JSON.parse(await readFile(CATALOG, 'utf8'))
  let sources: Record<string, string> = {}
  try {
    sources = JSON.parse(await readFile(SOURCES, 'utf8'))
  } catch {
    // first run
  }

  const todo = catalog.filter((shoe) => !sources[shoe.id])
  const missing: Shoe[] = []

  for (let i = 0; i < todo.length; i += PARALLEL_SHOES) {
    const batch = todo.slice(i, i + PARALLEL_SHOES)
    const results = await Promise.all(batch.map(findSource))
    batch.forEach((shoe, j) => {
      const url = results[j]
      if (url) sources[shoe.id] = url
      else missing.push(shoe)
      console.log(`${url ? 'found  ' : 'MISSING'} ${shoe.id} ${shoe.name}`)
    })
  }

  const ordered = Object.fromEntries(catalog.filter((s) => sources[s.id]).map((s) => [s.id, sources[s.id]]))
  await writeFile(SOURCES, JSON.stringify(ordered, null, 2) + '\n')
  console.log(`\n${Object.keys(ordered).length}/${catalog.length} found, ${missing.length} missing`)
}

await main()
