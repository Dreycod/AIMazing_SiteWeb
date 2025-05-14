/**
 * Formate une distance en mètres avec 2 décimales
 */
export const formatDistance = (distance) => {
  return `${Number.parseFloat(distance).toFixed(2)} m`
}

/**
 * Formate un temps en secondes
 */
export const formatTime = (seconds) => {
  return `${Number.parseFloat(seconds).toFixed(1)} s`
}

/**
 * Convertit un ID de direction en texte
 */
export const formatDirection = (directionId) => {
  const directions = {
    1: "Avant",
    2: "Arrière",
    3: "Gauche",
    4: "Droite",
    5: "Rotation Gauche",
    6: "Rotation Droite",
    7: "Diagonale Avant-Gauche",
    8: "Diagonale Avant-Droite",
    9: "Diagonale Arrière-Gauche",
    10: "Diagonale Arrière-Droite",
  }

  return directions[directionId] || `Direction ${directionId}`
}
