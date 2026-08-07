import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Brick from '../components/Brick'
import type { BrickData } from '../models/Brick'

const bricks: BrickData[] = [
  { id: '1', width: 2, length: 4, height: 3, color: 'red', position: [0, 0, 0] },
  { id: '2', width: 2, length: 4, height: 3, color: 'blue', position: [0, 9.6, 0] },
  { id: '3', width: 1, length: 2, height: 3, color: 'yellow', position: [30, 0, 0] },
]

function Scene() {
  return (
    <Canvas camera={{ position: [60, 60, 60], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />

      {bricks.map((brick) => (
        <Brick key={brick.id} {...brick} />
      ))}

      <OrbitControls />
    </Canvas>
  )
}

export default Scene
