import type { BrickData } from '../models/Brick'

const STORAGE_KEY = 'brickcad-save'

export function saveToLocalStorage(bricks: BrickData[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(bricks))
}

export function loadFromLocalStorage(): BrickData[] | null {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as BrickData[]
	} catch {
		return null
	}
}

export function hasSavedData(): boolean {
	return localStorage.getItem(STORAGE_KEY) !== null
}

export function exportToFile(bricks: BrickData[]): void {
	const json = JSON.stringify(bricks, null, 2)
	const blob = new Blob([json], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = url
	link.download = `brickcad-${Date.now()}.json`
	link.click()

	URL.revokeObjectURL(url)
}

export function importFromFile(file: File): Promise<BrickData[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result as string) as BrickData[]
				resolve(data)
			} catch {
				reject(new Error('Fichier invalide'))
			}
		}
		reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
		reader.readAsText(file)
	})
}

