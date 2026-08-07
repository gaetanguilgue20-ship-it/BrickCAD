import { useState } from 'react'
import type { BrickData } from '../models/Brick'
import { STUD_SPACING, BRICK_HEIGHT, STUD_RADIUS, STUD_HEIGHT } from '../models/units'

interface BrickProps extends BrickData {
  isSelected: boolean
  onSelect: (id: string) => void
}

function Brick({ id, width, length, height, color, position = [0, 0, 0], isSelected, onSelect }: BrickProps) {
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

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, l]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={hovered ? '#333333' : '#000000'}
        />
      </mesh>

      {studs.map((stud, i) => (
        <mesh key={i} position={[stud.x, h + STUD_HEIGHT / 2, stud.z]}>
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
