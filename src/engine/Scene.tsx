import { useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Brick from '../components/Brick'
import type { BrickData } from '../models/Brick'
import { snapAxis, effectiveSize } from '../models/units'
import { computeStackHeight } from './stacking'

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersectionPoint = new THREE.Vector3()

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

interface SceneProps {
  bricks: BrickData[]
  setBricks: React.Dispatch<React.SetStateAction<BrickData[]>>
}

function Scene({ bricks, setBricks }: SceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setBricks((prev) => prev.filter((b) => b.id !== selectedId))
        setSelectedId(null)
      }

      if (e.key.toLowerCase() === 'r' && selectedId) {
        setBricks((prev) =>
          prev.map((b) => {
            if (b.id !== selectedId) return b
            const newRotation = (b.rotation + 90) % 360
            const newY = computeStackHeight(
              b.id,
              b.width,
              b.length,
              newRotation,
              b.position[0],
              b.position[2],
              prev
            )
            return { ...b, rotation: newRotation, position: [b.position[0], newY, b.position[2]] }
          })
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, setBricks])

  function updateBrickPosition(id: string, x: number, z: number) {
    setBricks((prev) => {
      const dragged = prev.find((b) => b.id === id)
      if (!dragged) return prev

      const [effW, effL] = effectiveSize(dragged.width, dragged.length, dragged.rotation)
      const snappedX = snapAxis(x, effW)
      const snappedZ = snapAxis(z, effL)
      const newY = computeStackHeight(
        id,
        dragged.width,
        dragged.length,
        dragged.rotation,
        snappedX,
        snappedZ,
        prev
      )

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
