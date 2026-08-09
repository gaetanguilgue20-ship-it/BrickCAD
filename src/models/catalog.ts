export interface CatalogItem {
	catalogId: string
	name: string
	width: number
	length: number
	height: number // 3 = brique standard, 1 = plate
}

export const BRICK_SIZES: CatalogItem[] = [
	{ catalogId: '1x1', name: '1×1', width: 1, length: 1, height: 3 },
	{ catalogId: '1x2', name: '1×2', width: 1, length: 2, height: 3 },
	{ catalogId: '1x3', name: '1×3', width: 1, length: 3, height: 3 },
	{ catalogId: '1x4', name: '1×4', width: 1, length: 4, height: 3 },
	{ catalogId: '1x6', name: '1×6', width: 1, length: 6, height: 3 },
	{ catalogId: '1x8', name: '1×8', width: 1, length: 8, height: 3 },
	{ catalogId: '2x2', name: '2×2', width: 2, length: 2, height: 3 },
	{ catalogId: '2x3', name: '2×3', width: 2, length: 3, height: 3 },
	{ catalogId: '2x4', name: '2×4', width: 2, length: 4, height: 3 },
	{ catalogId: '2x6', name: '2×6', width: 2, length: 6, height: 3 },
	{ catalogId: '2x8', name: '2×8', width: 2, length: 8, height: 3 },
]

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

