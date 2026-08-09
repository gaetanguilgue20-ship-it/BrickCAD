export interface BrickData {
  id: string
  width: number
  length: number
  height: number
  color: string
  position: [number, number, number]
  rotation: number // en degrés : 0, 90, 180 ou 270
  shape: 'block' | 'slope'
}
