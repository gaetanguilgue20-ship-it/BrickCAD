import * as THREE from 'three'

// Construit une géométrie en forme de "pente" : un prisme dont le dessus
// descend progressivement de hauteur h (à l'arrière) à 0 (à l'avant)
export function buildSlopeGeometry(widthMM: number, lengthMM: number, heightMM: number): THREE.BufferGeometry {
  const hw = widthMM / 2
  const hl = lengthMM / 2
  const h = heightMM

  const vertices = new Float32Array([
    -hw, 0, -hl, // 0 arrière-bas-gauche
     hw, 0, -hl, // 1 arrière-bas-droit
    -hw, h, -hl, // 2 arrière-haut-gauche
     hw, h, -hl, // 3 arrière-haut-droit
    -hw, 0,  hl, // 4 avant-bas-gauche
     hw, 0,  hl, // 5 avant-bas-droit
  ])

  const indices = [
    0, 1, 3,  0, 3, 2, // face arrière (verticale)
    0, 1, 5,  0, 5, 4, // face du dessous
    2, 3, 5,  2, 5, 4, // face inclinée (la pente elle-même)
    0, 2, 4,           // triangle latéral gauche
    1, 3, 5,           // triangle latéral droit
  ]

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
