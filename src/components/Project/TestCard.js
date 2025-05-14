"use client"

import { useEffect, useState, useCallback } from "react"
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from "react-bootstrap"
import Particle from "../Particle"
import TestCard from "./TestCard"
import TestDetailsModal from "./TestDetailsModal"
import { getAllTests, getMouvementsByTest } from "../../services/api"
import "../../styles/project.css"

function ProjectTests() {
  const [tests, setTests] = useState([])
  const [filteredTests, setFilteredTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [mouvements, setMouvements] = useState([])
  const [loadingMouvements, setLoadingMouvements] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterModel, setFilterModel] = useState("")

  // Récupérer tous les tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const data = await getAllTests()
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

  // Récupérer les mouvements d'un test
  const fetchMouvements = useCallback(async (testId) => {
    try {
      setLoadingMouvements(true)
      const data = await getMouvementsByTest(testId)
      setMouvements(data)
      setLoadingMouvements(false)
    } catch (err) {
      console.error("Erreur lors du chargement des mouvements:", err)
      setMouvements([])
      setLoadingMouvements(false)
    }
  }, [])

  // Gérer l'ouverture du modal avec les détails du test
  const handleViewDetails = useCallback(
    (test) => {
      setSelectedTest(test)
      setShowModal(true)
      fetchMouvements(test.id)
    },
    [fetchMouvements],
  )

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Extraire les modèles uniques pour le filtre
  const uniqueModels = [...new Set(tests.map((test) => test.model_id))].sort((a, b) => a - b)

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <h1 className="text-center mb-5">
          Les détails des <strong className="purple">Tests</strong> du projet
        </h1>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Filtres */}
        <Row className="mb-4">
          <Col md={6} lg={4} className="mb-3 mb-md-0">
            <InputGroup>
              <InputGroup.Text>Test ID</InputGroup.Text>
              <Form.Control
                placeholder="Rechercher par ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} lg={4}>
            <InputGroup>
              <InputGroup.Text>Modèle</InputGroup.Text>
              <Form.Select value={filterModel} onChange={(e) => setFilterModel(e.target.value)}>
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
            <Spinner animation="border" />
            <p className="mt-3">Chargement des tests...</p>
          </div>
        ) : filteredTests.length > 0 ? (
          <Row>
            {filteredTests.map((test) => (
              <Col md={6} lg={4} key={test.id} className="mb-4">
                <TestCard test={test} onViewDetails={handleViewDetails} />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">Aucun test ne correspond à vos critères de recherche.</Alert>
        )}

        {/* Modal des détails du test */}
        <TestDetailsModal
          test={selectedTest}
          mouvements={mouvements}
          loading={loadingMouvements}
          show={showModal}
          onHide={handleCloseModal}
        />
      </Container>
    </Container>
  )
}

export default ProjectTests
