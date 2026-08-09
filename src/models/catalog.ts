export interface CatalogItem {
  catalogId: string
  name: string
  width: number
  length: number
  height: number // 3 = brique standard, 1 = plate (1/3 de la hauteur d'une brique)
  category: 'brick' | 'plate'
}

// Tailles courantes, en évitant les doublons (ex: 2x4 et 4x2 sont la même pièce, orientable via rotation)
const SIZES: [number, number][] = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 6], [1, 8], [1, 10], [1, 12],
  [2, 2], [2, 3], [2, 4], [2, 6], [2, 8], [2, 10], [2, 12],
  [3, 3], [3, 4], [3, 6],
  [4, 4], [4, 6], [4, 8], [4, 10],
  [6, 6], [6, 8],
  [8, 8],
]

function buildCatalog(category: 'brick' | 'plate', height: number, prefix: string): CatalogItem[] {
  return SIZES.map(([w, l]) => ({
    catalogId: `${prefix}-${w}x${l}`,
    name: `${w}×${l}`,
    width: w,
    length: l,
    height,
    category,
  }))
}

export const BRICKS: CatalogItem[] = buildCatalog('brick', 3, 'brick')
export const PLATES: CatalogItem[] = buildCatalog('plate', 1, 'plate')

// Gardé pour compatibilité (utilisé ailleurs) — regroupe tout
export const BRICK_SIZES: CatalogItem[] = [...BRICKS, ...PLATES]

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

export function getSizeName(width: number, length: number, height: number): string {
  const category = height === 1 ? 'Plaque' : 'Brique'
  const match = BRICK_SIZES.find(
    (b) =>
      b.height === height &&
      ((b.width === width && b.length === length) || (b.width === length && b.length === width))
  )
  return match ? `${category} ${match.name}` : `${category} ${width}×${length}`
}

export function getColorName(hex: string): string {
  const match = COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
  return match ? match.name : hex
}

