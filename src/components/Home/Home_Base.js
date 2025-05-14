"use client"
import { Container, Row, Col, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Particle from "../Particle"
import "./Home.css"

function Home_Base() {
  const navigate = useNavigate()

  const navigateToProject = () => {
    navigate("/project")
  }

  const navigateToTests = () => {
    navigate("/tests")
  }

  return (
    <div className="home-page">
      <Particle />

      {/* Section Hero */}
      <Container fluid className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="hero-content">
              <h1 className="hero-title">
                Projet <span className="highlight">AI-Mazing</span> CIEL2
              </h1>
              <p className="hero-subtitle">
                Un projet d'intelligence artificielle sur un automate capable de naviguer dans un labyrinthe
              </p>
              <div className="hero-buttons">
                <Button variant="primary" className="hero-button" onClick={navigateToProject}>
                  Voir la démo
                </Button>
                <Button variant="outline-light" className="hero-button" onClick={navigateToTests}>
                  Voir les tests
                </Button>
              </div>
            </Col>
            <Col md={5} className="hero-image-container">
              <div className="hero-image">
                <img src="/src/Assets/placeholder.svg?height=400&width=400" alt="Robot AI-Mazing" />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Section Fonctionnalités */}
      <Container fluid className="features-section">
        <Container>
          <h2 className="section-title">Fonctionnalités principales</h2>
          <Row className="features-grid">
            <Col md={3} sm={6} className="feature-item">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-robot"></i>
                </div>
                <h3 className="feature-title">Robotique Autonome</h3>
                <p className="feature-description">Navigation autonome dans un environnement inconnu</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="feature-item">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-wifi"></i>
                </div>
                <h3 className="feature-title">Connectivité Wi-Fi</h3>
                <p className="feature-description">Communication à distance via API</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="feature-item">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-gear"></i>
                </div>
                <h3 className="feature-title">Capteurs Avancés</h3>
                <p className="feature-description">Détection d'obstacles et cartographie</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="feature-item">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-cpu"></i>
                </div>
                <h3 className="feature-title">Intelligence Artificielle</h3>
                <p className="feature-description">Algorithmes d'optimisation des déplacements</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Section Appel à l'action */}
      <Container fluid className="cta-section">
        <Container className="text-center">
          <h2 className="cta-title">Prêt à explorer le projet ?</h2>
          <p className="cta-description">Découvrez les tests réalisés et les performances du robot</p>
          <Button variant="primary" size="lg" className="cta-button" onClick={navigateToTests}>
            Voir tous les tests
          </Button>
        </Container>
      </Container>
    </div>
  )
}

export default Home_Base
