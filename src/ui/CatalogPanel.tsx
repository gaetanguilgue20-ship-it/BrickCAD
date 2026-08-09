import { useState } from 'react'
import { BRICK_SIZES, COLORS } from '../models/catalog'

interface CatalogPanelProps {
	onAddBrick: (width: number, length: number, height: number, color: string) => void
}

function CatalogPanel({ onAddBrick }: CatalogPanelProps) {
	const [selectedColor, setSelectedColor] = useState(COLORS[0].hex)

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
			<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
		</div>
	)
}

export default CatalogPanel

