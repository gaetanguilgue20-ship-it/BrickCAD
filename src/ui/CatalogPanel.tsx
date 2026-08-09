import { useState, useRef } from 'react'
import { BRICK_SIZES, COLORS } from '../models/catalog'
import type { BrickData } from '../models/Brick'
import { saveToLocalStorage, loadFromLocalStorage, exportToFile, importFromFile } from '../engine/storage'

interface CatalogPanelProps {
	onAddBrick: (width: number, length: number, height: number, color: string) => void
	bricks: BrickData[]
	onLoadBricks: (bricks: BrickData[]) => void
}

function CatalogPanel({ onAddBrick, bricks, onLoadBricks }: CatalogPanelProps) {
	const [selectedColor, setSelectedColor] = useState(COLORS[0].hex)
	const fileInputRef = useRef<HTMLInputElement>(null)

	function handleSave() {
		saveToLocalStorage(bricks)
		alert('Construction sauvegardée !')
	}

	function handleLoad() {
		const loaded = loadFromLocalStorage()
		if (loaded) {
			onLoadBricks(loaded)
		} else {
			alert('Aucune sauvegarde trouvée.')
		}
	}

	async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		try {
			const loaded = await importFromFile(file)
			onLoadBricks(loaded)
		} catch {
			alert('Impossible de lire ce fichier.')
		}
		e.target.value = '' // permet de réimporter le même fichier plus tard si besoin
	}

	return (
		<div
			style={{
				width: '220px',
				height: '100vh',
				background: '#1e1e1e',
				color: 'white',
				padding: '16px',
				boxSizing: 'border-box',
				overflowY: 'auto',
				fontFamily: 'sans-serif',
			}}
		>
			<h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Catalogue</h2>

			<p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Couleur</p>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
				{COLORS.map((color) => (
					<button
						key={color.hex}
						onClick={() => setSelectedColor(color.hex)}
						title={color.name}
						style={{
							width: '28px',
							height: '28px',
							borderRadius: '50%',
							background: color.hex,
							border: selectedColor === color.hex ? '3px solid white' : '2px solid #444',
							cursor: 'pointer',
						}}
					/>
				))}
			</div>

			<p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Briques</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
				{BRICK_SIZES.map((item) => (
					<button
						key={item.catalogId}
						onClick={() => onAddBrick(item.width, item.length, item.height, selectedColor)}
						style={{
							padding: '8px 10px',
							background: '#2a2a2a',
							border: '1px solid #444',
							borderRadius: '6px',
							color: 'white',
							cursor: 'pointer',
							textAlign: 'left',
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						<span
							style={{
								width: '14px',
								height: '14px',
								background: selectedColor,
								borderRadius: '3px',
								display: 'inline-block',
							}}
						/>
						{item.name}
					</button>
				))}
			</div>

			<p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px' }}>Projet</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<button onClick={handleSave} style={buttonStyle}>💾 Sauvegarder</button>
				<button onClick={handleLoad} style={buttonStyle}>📂 Charger</button>
				<button onClick={() => exportToFile(bricks)} style={buttonStyle}>⬇️ Exporter (.json)</button>
				<button onClick={() => fileInputRef.current?.click()} style={buttonStyle}>⬆️ Importer (.json)</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="application/json"
					onChange={handleImport}
					style={{ display: 'none' }}
				/>
			</div>
		</div>
	)
}

const buttonStyle: React.CSSProperties = {
	padding: '8px 10px',
	background: '#2a2a2a',
	border: '1px solid #444',
	borderRadius: '6px',
	color: 'white',
	cursor: 'pointer',
	textAlign: 'left',
}

export default CatalogPanel

