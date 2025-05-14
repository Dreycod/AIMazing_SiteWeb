"use client"

import { useEffect, useState, useCallback } from "react"
import { Container, Row, Col, Spinner, Alert, Form, InputGroup, Card, Badge, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Particle from "../Particle"
import "../../styles/project.css"

function ProjectTests() {
  const [tests, setTests] = useState([])
  const [filteredTests, setFilteredTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterModel, setFilterModel] = useState("")
  const navigate = useNavigate()

  // Récupérer tous les tests
  useEffect(() => {
    const fetchTests = async () => {
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
        setFilteredTests(data)
        setLoading(false)
      } catch (err) {
        console.error("Erreur lors du chargement des tests:", err)
        setError("Impossible de charger les tests. Veuillez réessayer plus tard.")
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  // Filtrer les tests lorsque les critères de recherche changent
  useEffect(() => {
    if (tests.length > 0) {
      let filtered = [...tests]

      // Filtrer par terme de recherche (ID du test)
      if (searchTerm) {
        filtered = filtered.filter((test) => test.id.toString().includes(searchTerm))
      }

      // Filtrer par modèle
      if (filterModel) {
        filtered = filtered.filter((test) => test.model_id.toString() === filterModel)
      }

      setFilteredTests(filtered)
    }
  }, [searchTerm, filterModel, tests])

  // Gérer la navigation vers la page de visualisation
  const handleViewVisualization = useCallback(
    (testId) => {
      navigate(`/visualization/${testId}`)
    },
    [navigate],
  )

  // Extraire les modèles uniques pour le filtre
  const uniqueModels = [...new Set(tests.map((test) => test.model_id))].sort((a, b) => a - b)

  return (
    <div className="about-section">
      <Particle />
      <Container className="py-5">
        <h1 className="text-center mb-5 text-light">
          Les détails des <strong className="purple">Tests</strong> du projet
        </h1>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Filtres */}
        <Row className="mb-4 mx-0">
          <Col md={6} lg={4} className="mb-3 mb-md-0">
            <InputGroup>
              <InputGroup.Text className="bg-dark text-light border-secondary">Test ID</InputGroup.Text>
              <Form.Control
                placeholder="Rechercher par ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark text-light border-secondary"
              />
            </InputGroup>
          </Col>
          <Col md={6} lg={4}>
            <InputGroup>
              <InputGroup.Text className="bg-dark text-light border-secondary">Modèle</InputGroup.Text>
              <Form.Select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="bg-dark text-light border-secondary"
              >
                <option value="">Tous les modèles</option>
                {uniqueModels.map((model) => (
                  <option key={model} value={model}>
                    Modèle {model}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        {/* Liste des tests */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-light">Chargement des tests...</p>
          </div>
        ) : filteredTests.length > 0 ? (
          <Row className="mx-0">
            {filteredTests.map((test) => (
              <Col md={6} lg={4} key={test.id} className="mb-4 px-md-2">
                <Card className="h-100 border-0 shadow-sm bg-dark text-light test-card">
                  <Card.Header className="bg-dark border-secondary d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Test {test.id}</h5>
                    <Badge bg="info">Modèle {test.model_id}</Badge>
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
                  <Card.Footer className="bg-dark border-secondary d-flex justify-content-between">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleViewVisualization(test.id)}
                      style={{ zIndex: 100, position: "relative" }}
                    >
                      Voir la visualisation
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => {}}
                      style={{ zIndex: 100, position: "relative" }}
                    >
                      Détails
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="bg-dark text-light border-secondary">
            Aucun test ne correspond à vos critères de recherche.
          </Alert>
        )}
      </Container>
    </div>
  )
}

export default ProjectTests
