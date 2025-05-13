import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Accordion, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Particle from "../Particle";
import laptopImg from "../../Assets/about.png";

function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mouvements, setMouvements] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    // Étape 1 : Connexion pour obtenir le token
    fetch("http://este.alwaysdata.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "darklion84",
        password: "N4rT7kA2vL9pQwX3",
      }),
    })
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.token) throw new Error("Token non reçu");
        // Étape 2 : Appel à l'API avec le token
        return fetch("http://este.alwaysdata.net/getAllTest", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((result) => {
        setTests(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des tests:", error);
        setLoading(false);
      });
  }, []);

  
  const handleShowModal = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  
  // Fonction pour charger les mouvements d'un test donné
  const fetchMouvements = (testId) => {
    if (mouvements[testId]) return; // Évite de recharger si déjà récupéré
  
    console.log("Chargement des mouvements pour le test", testId);
  
    // Étape 1 : Connexion pour récupérer le token
    fetch("http://este.alwaysdata.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "darklion84",
        password: "N4rT7kA2vL9pQwX3",
      }),
    })
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.token) throw new Error("Token non reçu");
  
        // Étape 2 : Récupération des mouvements avec le token
        return fetch(`http://este.alwaysdata.net/getMouvementsByTest/${testId}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((result) => {
        setMouvements((prev) => ({ ...prev, [testId]: result }));
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des mouvements:", error)
      );
  };

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col md={7} style={{ justifyContent: "center", paddingTop: "30px", paddingBottom: "50px" }}>
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Les détails des <strong className="purple">Tests</strong> du projet
            </h1>
            
            {/* Affichage des tests */}
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <div>
                {tests.map((test) => (
                  <div key={test.id} style={{ marginBottom: '20px' }}>
                    <h5>
                      Test ID: {test.id} | Modèle ID: {test.model_id} | n_Mouvements: {test.n_mouvements}
                    </h5>
                    
                    {/* Bouton pour afficher le Modal avec les détails */}
                    <Button style={{ zIndex: 0 }}onClick={() => {handleShowModal(test); fetchMouvements(test.id);}}>Voir les détails</Button>
                  </div>
                ))}
              </div>
            )}

            {/* Modal pour afficher les détails du test sélectionné */}
            {selectedTest && (
              <Modal show={showModal} onHide={handleCloseModal} >
                <Modal.Header closeButton>
                  <Modal.Title>Détails du Test {selectedTest.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p><strong>Distance Totale:</strong> {selectedTest.distance_total} m</p>
                  <p><strong>Temps de Déplacement:</strong> {selectedTest.t_deplacement} s</p>
                  
                  {mouvements[selectedTest.id] ? (
                    <p>
                      {mouvements[selectedTest.id].map((mvt) => (
                        <p>
                          <br></br>
                          <p> 
                          <strong className="purple"> Mouvement ID: {mvt.id} </strong>
                            </p>
                          <p>
                          <strong>Direction ID:</strong> {mvt.direction_id}
                          </p>
                          <p>
                          <strong>Distance:</strong> {mvt.distance} m, 
                          </p>
                          <p>
                          <strong>Temps:</strong> {mvt.temps} s,  
                          </p>
                        </p>
                      ))}
                    </p>
                  ) : (
                    <p>Chargement des mouvements...</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
                </Modal.Footer>
              </Modal>
            )}

          </Col>

          <Col md={5} style={{ paddingTop: "120px", paddingBottom: "50px" }} className="about-img">
            <img src={laptopImg} alt="about" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Tests;
