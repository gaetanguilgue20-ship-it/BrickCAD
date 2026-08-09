import { useMemo, useState } from 'react'
import * as THREE from 'three'
import type { BrickData } from '../models/Brick'
import { STUD_SPACING, BRICK_HEIGHT } from '../models/units'
import { buildSlopeGeometry } from './slopeGeometry'

interface SlopeBrickProps extends BrickData {
  isSelected: boolean
  onSelect: (id: string) => void
  onDragStart: () => void
}

function SlopeBrick({ id, width, length, height, color, position, rotation, isSelected, onSelect, onDragStart }: SlopeBrickProps) {
  const [hovered, setHovered] = useState(false)

  const w = width * STUD_SPACING
  const l = length * STUD_SPACING
  const h = (height * BRICK_HEIGHT) / 3

  const geometry = useMemo(() => buildSlopeGeometry(w, l, h), [w, l, h])

  const displayColor = isSelected ? '#ffdd00' : color

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
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={displayColor}
          emissive={hovered ? '#333333' : '#000000'}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default SlopeBrick
