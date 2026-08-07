import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Brick from '../components/Brick'
import type { BrickData } from '../models/Brick'

const initialBricks: BrickData[] = [
  { id: '1', width: 2, length: 4, height: 3, color: 'red', position: [0, 0, 0] },
  { id: '2', width: 2, length: 4, height: 3, color: 'blue', position: [0, 9.6, 0] },
  { id: '3', width: 1, length: 2, height: 3, color: 'yellow', position: [30, 0, 0] },
]

function Scene() {
  const [bricks, setBricks] = useState<BrickData[]>(initialBricks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function updateBrickPosition(id: string, x: number, z: number) {
    setBricks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, position: [x, b.position[1], z] } : b
      )
    )
  }

  return (
    <Canvas
      camera={{ position: [60, 60, 60], fov: 50 }}
      onPointerMissed={() => setSelectedId(null)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerMove={(e) => {
          if (draggingId) {
            e.stopPropagation()
            updateBrickPosition(draggingId, e.point.x, e.point.z)
          }
        }}
        onPointerUp={() => setDraggingId(null)}
      >
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          {...brick}
          isSelected={brick.id === selectedId}
          onSelect={setSelectedId}
          onDragStart={() => setDraggingId(brick.id)}
        />
      ))}

      <OrbitControls enabled={!draggingId} />
    </Canvas>
  )
}

export default Scene
