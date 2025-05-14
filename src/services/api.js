// Constantes
const API_BASE_URL = "http://este.alwaysdata.net"
const AUTH_CREDENTIALS = {
  username: "darklion84",
  password: "N4rT7kA2vL9pQwX3",
}

/**
 * Obtient un token d'authentification
 */
const getAuthToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AUTH_CREDENTIALS),
    })

    const data = await response.json()

    if (!data.token) {
      throw new Error("Aucun token reçu")
    }

    return data.token
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    throw error
  }
}

/**
 * Effectue une requête authentifiée à l'API
 */
const authenticatedFetch = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la requête à ${endpoint}:`, error)
    throw error
  }
}

/**
 * Récupère tous les tests
 */
export const getAllTests = async () => {
  return authenticatedFetch("/getAllTest")
}

/**
 * Récupère les mouvements d'un test spécifique
 */
export const getMouvementsByTest = async (testId) => {
  return authenticatedFetch(`/getMouvementsByTest/${testId}`)
}

/**
 * Récupère les détails d'un test spécifique
 */
export const getTestDetails = async (testId) => {
  return authenticatedFetch(`/getTest/${testId}`)
}
