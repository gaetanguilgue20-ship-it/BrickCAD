import { useState } from 'react'
import type { BrickData } from '../models/Brick'
import { STUD_SPACING, BRICK_HEIGHT, STUD_RADIUS, STUD_HEIGHT } from '../models/units'
import SlopeBrick from './SlopeBricks'

interface BrickProps extends BrickData {
  isSelected: boolean
  onSelect: (id: string) => void
  onDragStart: () => void
}

function Brick({ id, width, length, height, color, position = [0, 0, 0], rotation = 0, shape = 'block', isSelected, onSelect, onDragStart }: BrickProps) {
  const [hovered, setHovered] = useState(false)

  const w = width * STUD_SPACING
  const l = length * STUD_SPACING
  const h = (height * BRICK_HEIGHT) / 3

  const studs: Array<{ x: number; z: number }> = []
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < length; z++) {
      studs.push({
        x: (x - (width - 1) / 2) * STUD_SPACING,
        z: (z - (length - 1) / 2) * STUD_SPACING,
      })
    }
  }

  const displayColor = isSelected ? '#ffdd00' : color

  if (shape === 'slope') {
    return (
      <SlopeBrick
        id={id}
        width={width}
        length={length}
        height={height}
        color={color}
        position={position}
        rotation={rotation}
        shape={shape}
        isSelected={isSelected}
        onSelect={onSelect}
        onDragStart={onDragStart}
      />
    )
  }

  return (
    <group
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        onSelect(id)
        onDragStart()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, l]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={hovered ? '#333333' : '#000000'}
        />
      </mesh>

      {studs.map((stud, i) => (
        <mesh key={i} position={[stud.x, h + STUD_HEIGHT / 2, stud.z]} castShadow receiveShadow>
          <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]} />
          <meshStandardMaterial
            color={displayColor}
            emissive={hovered ? '#333333' : '#000000'}
          />
        </mesh>
      ))}
    </group>
  )
}

export default Brick
