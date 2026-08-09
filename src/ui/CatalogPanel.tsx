import { useState, useRef, useMemo } from 'react'
import { BRICKS, PLATES, COLORS, getSizeName, getColorName } from '../models/catalog'
import type { BrickData } from '../models/Brick'
import { saveToLocalStorage, loadFromLocalStorage, exportToFile, importFromFile } from '../engine/storage'

interface CatalogPanelProps {
	onAddBrick: (width: number, length: number, height: number, color: string) => void
	bricks: BrickData[]
	onLoadBricks: (bricks: BrickData[]) => void
	onUndo: () => void
	onRedo: () => void
	canUndo: boolean
	canRedo: boolean
	viewMode: 'perspective' | 'top'
	onToggleView: () => void
}

function CatalogPanel({
	onAddBrick,
	bricks,
	onLoadBricks,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	viewMode,
	onToggleView,
}: CatalogPanelProps) {
	const [selectedColor, setSelectedColor] = useState(COLORS[0].hex)
	const [activeTab, setActiveTab] = useState<'brick' | 'plate'>('brick')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const items = activeTab === 'brick' ? BRICKS : PLATES

	const pieceCounts = useMemo(() => {
		const counts = new Map<string, number>()
		for (const b of bricks) {
			const key = `${getSizeName(b.width, b.length)} — ${getColorName(b.color)}`
			counts.set(key, (counts.get(key) ?? 0) + 1)
		}
		return Array.from(counts.entries())
	}, [bricks])

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
		e.target.value = ''
	}

	return (
		<div
			style={{
				width: '240px',
				height: '100vh',
				background: '#1e1e1e',
				color: 'white',
				padding: '16px',
				boxSizing: 'border-box',
				overflowY: 'auto',
				fontFamily: 'sans-serif',
			}}
		>
			<h2 style={{ fontSize: '16px', marginBottom: '12px' }}>BrickCAD</h2>

			<p style={sectionTitle}>Historique</p>
			<div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
				<button onClick={onUndo} disabled={!canUndo} style={{ ...buttonStyle, flex: 1, opacity: canUndo ? 1 : 0.4 }}>
					↶ Annuler
				</button>
				<button onClick={onRedo} disabled={!canRedo} style={{ ...buttonStyle, flex: 1, opacity: canRedo ? 1 : 0.4 }}>
					↷ Refaire
				</button>
			</div>

			<p style={sectionTitle}>Vue</p>
			<button onClick={onToggleView} style={{ ...buttonStyle, marginBottom: '20px' }}>
				{viewMode === 'perspective' ? '⬇️ Vue du dessus' : '↗️ Vue perspective'}
			</button>

			<p style={sectionTitle}>Couleur</p>
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

<p style={sectionTitle}>Pièces</p>
		<div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
			<button
				onClick={() => setActiveTab('brick')}
				style={{ ...buttonStyle, flex: 1, background: activeTab === 'brick' ? '#3a3a3a' : '#2a2a2a', textAlign: 'center' }}
			>
				Briques
			</button>
			<button
				onClick={() => setActiveTab('plate')}
				style={{ ...buttonStyle, flex: 1, background: activeTab === 'plate' ? '#3a3a3a' : '#2a2a2a', textAlign: 'center' }}
			>
				Plaques
			</button>
		</div>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '6px',
				marginBottom: '20px',
				maxHeight: '260px',
				overflowY: 'auto',
			}}
		>
			{items.map((item) => (
				<button
					key={item.catalogId}
					onClick={() => onAddBrick(item.width, item.length, item.height, selectedColor)}
					style={{ ...buttonStyle, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
				>
					<span
						style={{
							width: '12px',
							height: '12px',
							background: selectedColor,
							borderRadius: '3px',
							display: 'inline-block',
							flexShrink: 0,
							}}
						/>
						{item.name}
					</button>
				))}
			</div>

			<p style={sectionTitle}>Projet</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
				<button onClick={handleSave} style={buttonStyle}>💾 Sauvegarder</button>
				<button onClick={handleLoad} style={buttonStyle}>📂 Charger</button>
				<button onClick={() => exportToFile(bricks)} style={buttonStyle}>⬇️ Exporter (.json)</button>
				<button onClick={() => fileInputRef.current?.click()} style={buttonStyle}>⬆️ Importer (.json)</button>
				<input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} style={{ display: 'none' }} />
			</div>

			<p style={sectionTitle}>Pièces utilisées ({bricks.length})</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', opacity: 0.85 }}>
				{pieceCounts.length === 0 && <p style={{ opacity: 0.5 }}>Aucune pièce</p>}
				{pieceCounts.map(([label, count]) => (
					<div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>{label}</span>
						<span>×{count}</span>
					</div>
				))}
			</div>
		</div>
	)
}

const sectionTitle: React.CSSProperties = {
	fontSize: '13px',
	opacity: 0.7,
	marginBottom: '8px',
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

