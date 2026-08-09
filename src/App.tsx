import { useState } from 'react'
import Scene from './engine/Scene'
import CatalogPanel from './ui/CatalogPanel'
import type { BrickData } from './models/Brick'

const initialBricks: BrickData[] = [
  { id: '1', width: 2, length: 4, height: 3, color: '#c91a09', position: [0, 0, 0], rotation: 0 },
  { id: '2', width: 2, length: 4, height: 3, color: '#0055bf', position: [0, 9.6, 0], rotation: 0 },
  { id: '3', width: 1, length: 2, height: 3, color: '#f2cd37', position: [32, 0, 0], rotation: 0 },
]

function App() {
  const [bricks, setBricks] = useState<BrickData[]>(initialBricks)

  function addBrick(width: number, length: number, height: number, color: string) {
    const newBrick: BrickData = {
      id: crypto.randomUUID(),
      width,
      length,
      height,
      color,
      position: [80, 0, 0], // point d'apparition par défaut, à côté de la zone principale
      rotation: 0,
    }
    setBricks((prev) => [...prev, newBrick])
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <CatalogPanel onAddBrick={addBrick} bricks={bricks} onLoadBricks={setBricks} />
      <div style={{ flex: 1 }}>
        <Scene bricks={bricks} setBricks={setBricks} />
      </div>
    </div>
  )
}

export default App



