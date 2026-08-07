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
