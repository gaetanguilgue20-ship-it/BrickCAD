import { useState, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Brick from '../components/Brick'
import type { BrickData } from '../models/Brick'
import { snapAxis, effectiveSize, STUD_SPACING } from '../models/units'
import { computeStackHeight } from './stacking'

const groundPlaneMath = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
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
      if (raycaster.ray.intersectPlane(groundPlaneMath, intersectionPoint)) {
        onDrag(intersectionPoint.x, intersectionPoint.z)
      }
    }
  })

  return null
}

// Gère la position de la caméra selon le mode de vue choisi
function CameraController({ viewMode }: { viewMode: 'perspective' | 'top' }) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (viewMode === 'top') {
      camera.position.set(0, 300, 0.01)
    } else {
      camera.position.set(60, 60, 60)
    }
    camera.lookAt(0, 0, 0)
    controlsRef.current?.target.set(0, 0, 0)
    controlsRef.current?.update()
  }, [viewMode, camera])

  return <OrbitControls ref={controlsRef} makeDefault />
}

interface SceneProps {
  bricks: BrickData[]
  updateBricks: (updater: (prev: BrickData[]) => BrickData[]) => void
  commitBricks: (updater: (prev: BrickData[]) => BrickData[]) => void
  viewMode: 'perspective' | 'top'
}

function Scene({ bricks, updateBricks, commitBricks, viewMode }: SceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function updateBrickPosition(id: string, x: number, z: number) {
    updateBricks((prev) => {
      const dragged = prev.find((b) => b.id === id)
      if (!dragged) return prev

      const [effW, effL] = effectiveSize(dragged.width, dragged.length, dragged.rotation)
      const snappedX = snapAxis(x, effW)
      const snappedZ = snapAxis(z, effL)
      const newY = computeStackHeight(id, dragged.width, dragged.length, dragged.rotation, snappedX, snappedZ, prev)

      return prev.map((b) => (b.id === id ? { ...b, position: [snappedX, newY, snappedZ] } : b))
    })
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        commitBricks((prev) => prev.filter((b) => b.id !== selectedId))
        setSelectedId(null)
      }

      if (e.key.toLowerCase() === 'r' && selectedId && !e.ctrlKey) {
        commitBricks((prev) =>
          prev.map((b) => {
            if (b.id !== selectedId) return b
            const newRotation = (b.rotation + 90) % 360
            const newY = computeStackHeight(b.id, b.width, b.length, newRotation, b.position[0], b.position[2], prev)
            return { ...b, rotation: newRotation, position: [b.position[0], newY, b.position[2]] }
          })
        )
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'd' && selectedId) {
        e.preventDefault()
        const newId = crypto.randomUUID()
        commitBricks((prev) => {
          const original = prev.find((b) => b.id === selectedId)
          if (!original) return prev
          const offsetX = original.position[0] + STUD_SPACING * 2
          const offsetZ = original.position[2]
          const newY = computeStackHeight(newId, original.width, original.length, original.rotation, offsetX, offsetZ, prev)
          const duplicate: BrickData = { ...original, id: newId, position: [offsetX, newY, offsetZ] }
          return [...prev, duplicate]
        })
        setSelectedId(newId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, commitBricks])

  return (
    <Canvas
      shadows
      camera={{ position: [60, 60, 60], fov: 50 }}
      onPointerMissed={() => setSelectedId(null)}
      onPointerUp={() => setDraggingId(null)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[80, 150, 80]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />

      {/* Sol visuel avec ombre */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          setSelectedId(null)
        }}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>

      <gridHelper args={[400, 50, '#555555', '#3a3a3a']} />

      <DragTracker draggingId={draggingId} onDrag={(x, z) => updateBrickPosition(draggingId as string, x, z)} />

      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          {...brick}
          isSelected={brick.id === selectedId}
          onSelect={setSelectedId}
          onDragStart={() => {
            commitBricks((prev) => prev)
            setDraggingId(brick.id)
          }}
        />
      ))}

      <CameraController viewMode={viewMode} />
    </Canvas>
  )
}

export default Scene
