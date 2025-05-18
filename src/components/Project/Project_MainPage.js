"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Particle from "../Particle"
import VideoStream from "./VideoStream"
import "../../styles/project.css"

function ProjectMainPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalTests: 0,
    totalDistance: 0,
    totalTime: 0,
    averageMovements: 0,
  })

  // Utiliser useNavigate pour la navigation
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Étape 1 : Authentification
        const response = await fetch("http://este.alwaysdata.net/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "darklion84",
            password: "N4rT7kA2vL9pQwX3",
          }),
        })

        const authData = await response.json()

        if (!authData.token) {
          throw new Error("Aucun token reçu")
        }

        // Étape 2 : Récupération des données
        const testResponse = await fetch("http://este.alwaysdata.net/getAllTest", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        })

        const data = await testResponse.json()
        setTests(data)

        // Calculer les statistiques
        if (data.length > 0) {
          const totalDistance = data.reduce((sum, test) => sum + Number.parseFloat(test.distance_total), 0)
          const totalTime = data.reduce((sum, test) => sum + Number.parseFloat(test.t_deplacement), 0)
          const totalMovements = data.reduce((sum, test) => sum + Number.parseInt(test.n_mouvements), 0)

          setStats({
            totalTests: data.length,
            totalDistance: totalDistance.toFixed(2),
            totalTime: totalTime.toFixed(1),
            averageMovements: (totalMovements / data.length).toFixed(1),
          })
        }

        setLoading(false)
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Afficher seulement les 3 derniers tests
  const recentTests = tests.slice(0, 3)

  // Fonction pour naviguer vers la page des tests
  const handleViewAllTests = () => {
    navigate("/tests")
  }

  return (
    <div className="about-section">
      <Particle />
      <Container className="py-5">
        <h1 className="text-center mb-4 text-light">
          Les <strong className="purple">détails</strong> du projet
        </h1>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="mb-5 mx-0">
           <Col lg={8} className="mb-4 mb-lg-0 px-md-2">
            <VideoStream streamUrl="http://webcam.scs.ryerson.ca/mjpg/video.mjpg" />
          </Col>
          
          <Col lg={4} className="px-md-2">
            <Row className="mx-0">
              <Col xs={12} className="mb-4 px-0">
                <Card className="h-100 border-0 shadow-sm bg-dark text-light">
                  <Card.Header className="bg-dark border-secondary">
                    <h5 className="mb-0">Statistiques Globales</h5>
                  </Card.Header>
                  <Card.Body className="bg-dark">
                    {loading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" variant="light" size="sm" />
                      </div>
                    ) : (
                      <Row className="mx-0">
                        <Col xs={6} className="mb-3 px-2 text-center">
                          <h6 className="text-light small">Tests</h6>
                          <p className="h3 text-primary mb-0">{stats.totalTests}</p>
                        </Col>
                        <Col xs={6} className="mb-3 px-2 text-center">
                          <h6 className="text-light small">Mouvements</h6>
                          <p className="h3 text-primary mb-0">{stats.averageMovements}</p>
                        </Col>
                        <Col xs={6} className="px-2 text-center">
                          <h6 className="text-light small">Distance</h6>
                          <p className="h5 text-primary mb-0">{stats.totalDistance} m</p>
                        </Col>
                        <Col xs={6} className="px-2 text-center">
                          <h6 className="text-light small">Temps</h6>
                          <p className="h5 text-primary mb-0">{stats.totalTime} s</p>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} className="px-0">
                <Card className="border-0 shadow-sm bg-dark text-light">
                  <Card.Header className="bg-dark border-secondary d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">État du Robot</h5>
                    <span className="badge bg-success">Connecté</span>
                  </Card.Header>
                  <Card.Body className="bg-dark">
                    <Row className="mx-0">
                      <Col xs={12} className="mb-3 px-2">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-light">Batterie</small>
                          <small className="text-light">85%</small>
                        </div>
                        <div className="progress bg-secondary" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "85%" }}
                            aria-valuenow="85"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </Col>
                      <Col xs={12} className="px-2">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-light">Signal</small>
                          <small className="text-light">92%</small>
                        </div>
                        <div className="progress bg-secondary" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: "92%" }}
                            aria-valuenow="92"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <h2 className="text-center mb-4 text-light">
          Tests <strong className="purple">récents</strong>
        </h2>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-light">Chargement des tests...</p>
          </div>
        ) : (
          <>
            <Row className="mx-0">
              {recentTests.map((test) => (
                <Col md={4} key={test.id} className="mb-4 px-md-2">
                  <Card className="h-100 border-0 shadow-sm bg-dark text-light">
                    <Card.Header className="bg-dark border-secondary d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Test {test.id}</h5>
                      <span className="badge bg-info">Modèle {test.model_id}</span>
                    </Card.Header>
                    <Card.Body className="bg-dark">
                      <Row className="mx-0">
                        <Col xs={6} className="px-2">
                          <p className="mb-1 small text-light">
                            <strong>Mouvements:</strong> {test.n_mouvements}
                          </p>
                          <p className="mb-0 small text-light">
                            <strong>Distance:</strong> {test.distance_total} m
                          </p>
                        </Col>
                        <Col xs={6} className="px-2">
                          <p className="mb-0 small text-light">
                            <strong>Temps:</strong> {test.t_deplacement} s
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-3 mb-4">
              <button
                onClick={handleViewAllTests}
                className="btn-purple btn-lg"
                style={{ zIndex: 100, position: "relative" }}
              >
                Voir les détails des tests
              </button>
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

export default ProjectMainPage
