import type { BrickData } from '../models/Brick'
import { STUD_SPACING, BRICK_HEIGHT, effectiveSize } from '../models/units'

interface Footprint {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export function getFootprint(
  width: number,
  length: number,
  rotation: number,
  x: number,
  z: number
): Footprint {
  const [w, l] = effectiveSize(width, length, rotation)
  const halfW = (w * STUD_SPACING) / 2
  const halfL = (l * STUD_SPACING) / 2
  return { minX: x - halfW, maxX: x + halfW, minZ: z - halfL, maxZ: z + halfL }
}

function overlaps(a: Footprint, b: Footprint): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ
}

export function brickHeightMM(brick: BrickData): number {
  return (brick.height * BRICK_HEIGHT) / 3
}

export function computeStackHeight(
  draggedId: string,
  width: number,
  length: number,
  rotation: number,
  x: number,
  z: number,
  allBricks: BrickData[]
): number {
  const footprint = getFootprint(width, length, rotation, x, z)
  let topY = 0

  for (const brick of allBricks) {
    if (brick.id === draggedId) continue

    const otherFootprint = getFootprint(
      brick.width,
      brick.length,
      brick.rotation,
      brick.position[0],
      brick.position[2]
    )
    if (overlaps(footprint, otherFootprint)) {
      const brickTop = brick.position[1] + brickHeightMM(brick)
      if (brickTop > topY) {
        topY = brickTop
      }
    }
  }

  return topY
}
