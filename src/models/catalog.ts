export interface CatalogItem {
  catalogId: string
  name: string
  width: number
  length: number
  height: number
  shape: 'block' | 'slope'
}

const SIZES: [number, number][] = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 6], [1, 8], [1, 10], [1, 12],
  [2, 2], [2, 3], [2, 4], [2, 6], [2, 8], [2, 10], [2, 12],
  [3, 3], [3, 4], [3, 6],
  [4, 4], [4, 6], [4, 8], [4, 10],
  [6, 6], [6, 8],
  [8, 8],
]

function buildCatalog(height: number, prefix: string): CatalogItem[] {
  return SIZES.map(([w, l]) => ({
    catalogId: `${prefix}-${w}x${l}`,
    name: `${w}×${l}`,
    width: w,
    length: l,
    height,
    shape: 'block',
  }))
}

export const BRICKS: CatalogItem[] = buildCatalog(3, 'brick')
export const PLATES: CatalogItem[] = buildCatalog(1, 'plate')

export const SLOPES: CatalogItem[] = [
  { catalogId: 'slope-2x1', name: '2×1', width: 2, length: 1, height: 3, shape: 'slope' },
  { catalogId: 'slope-3x1', name: '3×1', width: 3, length: 1, height: 3, shape: 'slope' },
  { catalogId: 'slope-4x1', name: '4×1', width: 4, length: 1, height: 3, shape: 'slope' },
  { catalogId: 'slope-2x2', name: '2×2', width: 2, length: 2, height: 3, shape: 'slope' },
  { catalogId: 'slope-4x2', name: '4×2', width: 4, length: 2, height: 3, shape: 'slope' },
]

const ALL_ITEMS: CatalogItem[] = [...BRICKS, ...PLATES, ...SLOPES]

export const COLORS: { name: string; hex: string }[] = [
  { name: 'Rouge', hex: '#c91a09' },
  { name: 'Bleu', hex: '#0055bf' },
  { name: 'Jaune', hex: '#f2cd37' },
  { name: 'Vert', hex: '#237841' },
  { name: 'Blanc', hex: '#f4f4f4' },
  { name: 'Noir', hex: '#1b1b1b' },
  { name: 'Orange', hex: '#fe8a18' },
  { name: 'Gris', hex: '#6c6e68' },
]

export function getSizeName(width: number, length: number, height: number, shape: 'block' | 'slope'): string {
  const category = shape === 'slope' ? 'Pente' : height === 1 ? 'Plaque' : 'Brique'
  const match = ALL_ITEMS.find(
    (b) =>
      b.shape === shape &&
      b.height === height &&
      ((b.width === width && b.length === length) || (b.width === length && b.length === width))
  )
  return match ? `${category} ${match.name}` : `${category} ${width}×${length}`
}

export function getColorName(hex: string): string {
  const match = COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
  return match ? match.name : hex
}

