import { useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Brick from '../components/Brick'
import type { BrickData } from '../models/Brick'
import { snapToGrid } from '../models/units'
import { computeStackHeight } from './stacking'

const initialBricks: BrickData[] = [
  { id: '1', width: 2, length: 4, height: 3, color: 'red', position: [0, 0, 0] },
  { id: '2', width: 2, length: 4, height: 3, color: 'blue', position: [0, 9.6, 0] },
  { id: '3', width: 1, length: 2, height: 3, color: 'yellow', position: [30, 0, 0] },
]

// Plan mathématique horizontal (y = 0), indépendant de tout objet visible
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersectionPoint = new THREE.Vector3()

// Ce composant ne rend rien : il calcule juste, à chaque frame, où pointe la souris sur le plan
function DragTracker({
  draggingId,
  onDrag,
}: {
  draggingId: string | null
  onDrag: (x: number, z: number) => void
}) {
  const { raycaster } = useThree()

  useFrame(() => {
    if (draggingId) {
      if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
        onDrag(intersectionPoint.x, intersectionPoint.z)
      }
    }
  })

  return null
}

function Scene() {
  const [bricks, setBricks] = useState<BrickData[]>(initialBricks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function updateBrickPosition(id: string, x: number, z: number) {
    setBricks((prev) => {
      const dragged = prev.find((b) => b.id === id)
      if (!dragged) return prev

      const snappedX = snapToGrid(x)
      const snappedZ = snapToGrid(z)
      const newY = computeStackHeight(id, dragged.width, dragged.length, snappedX, snappedZ, prev)

      return prev.map((b) =>
        b.id === id ? { ...b, position: [snappedX, newY, snappedZ] } : b
      )
    })
  }

  return (
    <Canvas
      camera={{ position: [60, 60, 60], fov: 50 }}
      onPointerMissed={() => setSelectedId(null)}
      onPointerUp={() => setDraggingId(null)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />

      <DragTracker
        draggingId={draggingId}
        onDrag={(x, z) => updateBrickPosition(draggingId as string, x, z)}
      />

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
