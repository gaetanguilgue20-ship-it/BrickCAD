import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Brick from '../components/Brick'

function Scene() {
  return (
    <Canvas camera={{ position: [40, 40, 40], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />

      <Brick width={2} length={4} height={3} color="red" />

      <OrbitControls />
    </Canvas>
  )
}

export default Scene
