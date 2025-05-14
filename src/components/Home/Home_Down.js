"use client"

import { useEffect, useState, useRef } from "react"
import { Container, Row, Col, Card, Button, ProgressBar } from "react-bootstrap"
import { AiFillGithub } from "react-icons/ai"
import { BsArrowRightCircle, BsRobot, BsWifi, BsGear, BsCodeSlash } from "react-icons/bs"
import "./Home.css"

function Home_Down({ navigateToTests }) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("features")
  const sectionRef = useRef(null)

  // Observer pour l'animation au défilement
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  // Caractéristiques du projet
  const features = [
    {
      icon: <BsRobot />,
      title: "Robotique Autonome",
      description: "Système capable de naviguer de manière autonome dans un environnement inconnu.",
    },
    {
      icon: <BsWifi />,
      title: "Connectivité Wi-Fi",
      description: "Communication à distance via API pour le contrôle et la collecte de données.",
    },
    {
      icon: <BsGear />,
      title: "Capteurs Avancés",
      description: "Utilisation de capteurs multiples ou d'une caméra pour la détection d'obstacles.",
    },
    {
      icon: <BsCodeSlash />,
      title: "Intelligence Artificielle",
      description: "Algorithmes d'IA pour l'optimisation des déplacements et l'apprentissage.",
    },
  ]

  // Statistiques du projet
  const stats = [
    { label: "Tests réalisés", value: 24, suffix: "" },
    { label: "Mouvements enregistrés", value: 156, suffix: "" },
    { label: "Distance parcourue", value: 450, suffix: "m" },
    { label: "Taux de réussite", value: 92, suffix: "%" },
  ]

  // Étapes du projet
  const steps = [
    {
      title: "Conception",
      description: "Élaboration du design et des spécifications techniques du robot.",
      progress: 100,
      date: "Janvier 2023",
    },
    {
      title: "Développement",
      description: "Programmation des algorithmes et intégration des composants.",
      progress: 100,
      date: "Mars 2023",
    },
    {
      title: "Tests",
      description: "Phase de tests et d'optimisation des performances.",
      progress: 85,
      date: "Mai 2023",
    },
    {
      title: "Déploiement",
      description: "Mise en production et déploiement final.",
      progress: 60,
      date: "Juillet 2023",
    },
  ]

  // Fonction pour afficher les valeurs des statistiques
  const StatValue = ({ value, suffix }) => {
    return (
      <div style={{ height: 60 }}>
        {value}
        {suffix}
      </div>
    )
  }

  return (
    <Container fluid className="home-about-section" ref={sectionRef}>
      <Container>
        <Row className="mb-5">
          <Col className={`home-about-description ${isVisible ? "fade-in" : ""}`}>
            <h1 className="section-title">
              Description du Projet: <span className="purple"> AI-Mazing </span>
            </h1>

            <div className="synoptique-container">
              <div className="synoptique-img-wrapper">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  className="synoptique-img"
                  alt="Diagramme synoptique du projet"
                />
              </div>
            </div>

            <p className="project-description">
              Ce projet vise à développer un automate embarqué basé sur une carte type Arduino UNO. Il inclut la gestion
              de capteurs (gauche, droite, avant, arrière) ou d'une caméra pour détecter l'environnement, ainsi que le
              contrôle de moteurs pas à pas via des GPIO. L'automate doit être capable de se déplacer de manière
              autonome en fonction des données collectées par les capteurs, tout en étant connecté à distance à une
              <b className="purple"> API via Wi-Fi </b> pour échanger des informations.
            </p>
          </Col>
        </Row>

        {/* Onglets de navigation */}
        <div className="tabs-container">
          <div className={`tab ${activeTab === "features" ? "active" : ""}`} onClick={() => setActiveTab("features")}>
            Fonctionnalités
          </div>
          <div className={`tab ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
            Statistiques
          </div>
          <div className={`tab ${activeTab === "timeline" ? "active" : ""}`} onClick={() => setActiveTab("timeline")}>
            Chronologie
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Fonctionnalités */}
          {activeTab === "features" && (
            <Row className={`features-row ${isVisible ? "fade-in-up" : ""}`}>
              {features.map((feature, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <Card className="feature-card">
                    <Card.Body>
                      <div className="feature-icon">{feature.icon}</div>
                      <Card.Title className="feature-title">{feature.title}</Card.Title>
                      <Card.Text className="feature-text">{feature.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Statistiques */}
          {activeTab === "stats" && (
            <Row className="stats-row">
              {stats.map((stat, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="stat-value">
                        <StatValue value={stat.value} suffix={stat.suffix} />
                      </div>
                      <Card.Title className="stat-label">{stat.label}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              <Col xs={12} className="text-center mt-4">
                <Button variant="outline-light" className="explore-button primary-btn" onClick={navigateToTests}>
                  Voir tous les tests
                </Button>
              </Col>
            </Row>
          )}

          {/* Chronologie */}
          {activeTab === "timeline" && (
            <div className="timeline-container">
              {steps.map((step, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-date">{step.date}</div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">{step.title}</h3>
                    <p className="timeline-description">{step.description}</p>
                    <ProgressBar
                      now={step.progress}
                      label={`${step.progress}%`}
                      variant={step.progress === 100 ? "success" : "primary"}
                      className="timeline-progress"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Row className={`mt-5 ${isVisible ? "fade-in-up delay-2" : ""}`}>
          <Col md={12} className="home-about-social">
            <h1 className="resources-title">Ressources</h1>
            <p className="resources-text">
              Pouvez avoir accès <span className="purple"> au projet (open source) </span> sur le lien github
            </p>

            <div className="github-link-container">
              <Button
                variant="outline-light"
                className="github-button"
                href="https://github.com/Dreycod/AImazing_DOJO"
                target="_blank"
                rel="noreferrer"
              >
                <AiFillGithub className="github-icon" /> Voir sur GitHub <BsArrowRightCircle className="ms-2" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  )
}

export default Home_Down
