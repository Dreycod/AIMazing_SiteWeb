"use client"

import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Spinner, Alert, Button, Card } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import Particle from "../Particle"
import "./TestVisualization.css"

// Constantes pour la visualisation
const CELL_SIZE = 40
const GRID_SIZE = 10 // Changé de 11 à 10 pour correspondre à la nouvelle matrice
const ANIMATION_SPEED = 500 // ms par mouvement

// Directions mises à jour selon l'image fournie
const DIRECTIONS = {
  1: { name: "Droite", dx: 1, dy: 0, color: "#FF9800", icon: "→" },
  2: { name: "Gauche", dx: -1, dy: 0, color: "#2196F3", icon: "←" },
  3: { name: "Haut", dx: 0, dy: -1, color: "#4CAF50", icon: "↑" },
  4: { name: "Bas", dx: 0, dy: 1, color: "#F44336", icon: "↓" },
  5: { name: "Rotation Gauche", dx: 0, dy: 0, color: "#9C27B0", icon: "↺" },
  6: { name: "Rotation Droite", dx: 0, dy: 0, color: "#673AB7", icon: "↻" },
}

function TestVisualization() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [mouvements, setMouvements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Labyrinthe mis à jour selon la matrice fournie (10x10)
  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]

  // Position initiale du robot (ajustée pour la nouvelle matrice)
  const initialPosition = { x: 1, y: 1 }

  // Destination (ajustée pour la nouvelle matrice)
  const destination = { x: 4, y: 4 }

  // Récupérer les données du test et des mouvements
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Étape 1 : Authentification
        const authResponse = await fetch("http://este.alwaysdata.net/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "darklion84",
            password: "N4rT7kA2vL9pQwX3",
          }),
        })

        const authData = await authResponse.json()
        if (!authData.token) {
          throw new Error("Échec de l'authentification")
        }

        // Étape 2 : Récupérer les détails du test
        const testResponse = await fetch(`http://este.alwaysdata.net/getTest/${testId}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        })

        const testData = await testResponse.json()
        setTest(testData)

        // Étape 3 : Récupérer les mouvements du test
        const mouvementsResponse = await fetch(`http://este.alwaysdata.net/getMouvementsByTest/${testId}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        })

        const mouvementsData = await mouvementsResponse.json()
        setMouvements(mouvementsData)
        setLoading(false)
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError(`Erreur: ${err.message}`)
        setLoading(false)
      }
    }

    fetchData()

    // Nettoyage de l'animation à la sortie
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [testId])

  // Dessiner le labyrinthe et le robot
  useEffect(() => {
    if (loading || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = CELL_SIZE * GRID_SIZE
    const height = CELL_SIZE * GRID_SIZE

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height)

    // Dessiner le labyrinthe
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = maze[y][x]
        ctx.fillStyle = cell === 1 ? "#000000" : "#FFFFFF"
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

        // Dessiner la grille
        ctx.strokeStyle = "#CCCCCC"
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }
    }

    // Dessiner la destination
    ctx.fillStyle = "#FF0000"
    ctx.fillRect(destination.x * CELL_SIZE, destination.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

    // Calculer la position actuelle du robot
    let robotX = initialPosition.x
    let robotY = initialPosition.y

    if (currentStep >= 0 && mouvements.length > 0) {
      // Tracer le chemin jusqu'à l'étape actuelle
      ctx.strokeStyle = "#3498db"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(initialPosition.x * CELL_SIZE + CELL_SIZE / 2, initialPosition.y * CELL_SIZE + CELL_SIZE / 2)

      let x = initialPosition.x
      let y = initialPosition.y

      for (let i = 0; i <= currentStep && i < mouvements.length; i++) {
        const mouvement = mouvements[i]
        const direction = DIRECTIONS[mouvement.direction_id]

        if (direction) {
          // Pour les mouvements de rotation, on ne change pas de position
          if (mouvement.direction_id !== 5 && mouvement.direction_id !== 6) {
            x += direction.dx
            y += direction.dy
            ctx.lineTo(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2)
          }
        }
      }

      ctx.stroke()

      // Mettre à jour la position finale du robot
      robotX = x
      robotY = y
    }

    // Dessiner le robot
    ctx.fillStyle = "#0000FF"
    ctx.beginPath()
    ctx.arc(robotX * CELL_SIZE + CELL_SIZE / 2, robotY * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2)
    ctx.fill()
  }, [loading, currentStep, mouvements])

  // Gérer l'animation
  useEffect(() => {
    if (isPlaying && currentStep < mouvements.length - 1) {
      animationRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, ANIMATION_SPEED / speed)
    } else if (currentStep >= mouvements.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isPlaying, currentStep, mouvements, speed])

  // Contrôles de l'animation
  const handlePlay = () => {
    if (currentStep >= mouvements.length - 1) {
      setCurrentStep(-1)
      setTimeout(() => setIsPlaying(true), 100)
    } else {
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }

  const handleSpeedChange = () => {
    setSpeed((prevSpeed) => (prevSpeed === 1 ? 2 : prevSpeed === 2 ? 4 : 1))
  }

  const handleGoBack = () => {
    navigate("/tests")
  }

  // Formater la direction
  const formatDirection = (directionId) => {
    return DIRECTIONS[directionId]?.name || `Direction ${directionId}`
  }

  return (
    <div className="visualization-section">
      <Particle />
      <Container className="py-5">
        <Button variant="outline-light" className="mb-4" onClick={handleGoBack}>
          <span className="icon-back">←</span> Retour aux tests
        </Button>

        <h1 className="text-center mb-4 text-light">
          Visualisation du Test <span className="purple">#{testId}</span>
        </h1>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-light">Chargement des données...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="bg-dark text-light border-0 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Labyrinthe</h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant={isPlaying ? "outline-light" : "outline-success"}
                      size="sm"
                      onClick={isPlaying ? handlePause : handlePlay}
                    >
                      {isPlaying ? <span className="icon">⏸</span> : <span className="icon">▶</span>}
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={handleReset}>
                      <span className="icon">↺</span>
                    </Button>
                    <Button variant="outline-info" size="sm" onClick={handleSpeedChange}>
                      <span className="icon">⏩</span> {speed}x
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0 d-flex justify-content-center">
                  <canvas
                    ref={canvasRef}
                    width={CELL_SIZE * GRID_SIZE}
                    height={CELL_SIZE * GRID_SIZE}
                    className="maze-canvas"
                  />
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      Étape: {currentStep + 1} / {mouvements.length}
                    </div>
                    <div>
                      {currentStep >= 0 && currentStep < mouvements.length ? (
                        <span>Direction: {formatDirection(mouvements[currentStep].direction_id)}</span>
                      ) : (
                        <span>Position initiale</span>
                      )}
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="bg-dark text-light border-0 shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Détails du Test</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>ID du Test:</strong> {test?.id}
                  </div>
                  <div className="mb-3">
                    <strong>Modèle:</strong> {test?.model_id}
                  </div>
                  <div className="mb-3">
                    <strong>Distance Totale:</strong> {test?.distance_total} m
                  </div>
                  <div className="mb-3">
                    <strong>Temps de Déplacement:</strong> {test?.t_deplacement} s
                  </div>
                  <div>
                    <strong>Nombre de Mouvements:</strong> {test?.n_mouvements}
                  </div>
                </Card.Body>
              </Card>

              <Card className="bg-dark text-light border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Légende</h5>
                </Card.Header>
                <Card.Body>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#0000FF" }}></div>
                    <div>Robot</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#FF0000" }}></div>
                    <div>Destination</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#000000" }}></div>
                    <div>Mur</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#FFFFFF" }}></div>
                    <div>Chemin</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-line"></div>
                    <div>Trajet parcouru</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} className="mt-4">
              <Card className="bg-dark text-light border-0 shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Mouvements</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Direction</th>
                          <th>Distance (m)</th>
                          <th>Temps (s)</th>
                          <th>État</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mouvements.map((mouvement, index) => (
                          <tr key={mouvement.id} className={index === currentStep ? "table-primary" : ""}>
                            <td>{mouvement.id}</td>
                            <td>
                              <span
                                className="direction-badge"
                                style={{ backgroundColor: DIRECTIONS[mouvement.direction_id]?.color || "#777" }}
                              >
                                {DIRECTIONS[mouvement.direction_id]?.icon || "?"}
                              </span>
                              {formatDirection(mouvement.direction_id)}
                            </td>
                            <td>{mouvement.distance}</td>
                            <td>{mouvement.temps}</td>
                            <td>
                              {index < currentStep ? (
                                <span className="badge bg-success">Complété</span>
                              ) : index === currentStep ? (
                                <span className="badge bg-primary">En cours</span>
                              ) : (
                                <span className="badge bg-secondary">En attente</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}

export default TestVisualization
