export const STUD_SPACING = 8
export const PLATE_HEIGHT = 3.2
export const BRICK_HEIGHT = 9.6
export const STUD_RADIUS = 2.4
export const STUD_HEIGHT = 1.7
export const WALL_MARGIN = 0.1

// Arrondit une valeur au multiple le plus proche de la grille LEGO
export function snapToGrid(value: number): number {
  return Math.round(value / STUD_SPACING) * STUD_SPACING
}

// Arrondit une valeur à la grille des plots, en tenant compte de la parité
// de la dimension de la brique sur cet axe (nombre de plots : width ou length)
export function snapAxis(value: number, sizeInStuds: number): number {
  const isEven = sizeInStuds % 2 === 0
  const offset = isEven ? STUD_SPACING / 2 : 0
  return Math.round((value - offset) / STUD_SPACING) * STUD_SPACING + offset
}
