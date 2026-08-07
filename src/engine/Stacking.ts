import { BrickData } from '../models/Brick'
import { STUD_SPACING, BRICK_HEIGHT } from '../models/units'

interface Footprint {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

// Calcule l'emprise au sol (rectangle) d'une brique à une position donnée
export function getFootprint(width: number, length: number, x: number, z: number): Footprint {
  const halfW = (width * STUD_SPACING) / 2
  const halfL = (length * STUD_SPACING) / 2
  return { minX: x - halfW, maxX: x + halfW, minZ: z - halfL, maxZ: z + halfL }
}

// Deux emprises se chevauchent-elles ?
function overlaps(a: Footprint, b: Footprint): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ
}

// Hauteur réelle (mm) d'une brique
export function brickHeightMM(brick: BrickData): number {
  return (brick.height * BRICK_HEIGHT) / 3
}

// Calcule la hauteur à laquelle poser une brique en fonction de ce qu'il y a en dessous
export function computeStackHeight(
  draggedId: string,
  width: number,
  length: number,
  x: number,
  z: number,
  allBricks: BrickData[]
): number {
  const footprint = getFootprint(width, length, x, z)
  let topY = 0 // par défaut, le sol

  for (const brick of allBricks) {
    if (brick.id === draggedId) continue // on ignore la brique qu'on déplace elle-même

    const otherFootprint = getFootprint(brick.width, brick.length, brick.position[0], brick.position[2])
    if (overlaps(footprint, otherFootprint)) {
      const brickTop = brick.position[1] + brickHeightMM(brick)
      if (brickTop > topY) {
        topY = brickTop
      }
    }
  }

  return topY
}
