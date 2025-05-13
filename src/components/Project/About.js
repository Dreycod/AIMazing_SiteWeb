import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button  } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import pour la navigation
import Particle from "../Particle";
import laptopImg from "../../Assets/about.png";

function About() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Étape 1 : Authentification
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
      .then((response) => response.json())
      .then((authData) => {
        if (!authData.token) {
          throw new Error("Aucun token reçu");
        }

        // Étape 2 : Utilisation du token pour récupérer les données protégées
        return fetch("http://este.alwaysdata.net/getAllTest", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
      })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données:", error)
      );
  }, []);

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Les <strong className="purple">détails</strong> du projet
            </h1>
            
            {/* Affichage des données récupérées */}
            <h1 style={{ fontSize: "1.4em", paddingBottom: "20px" }}>
              Les <strong className="purple">Tests</strong> réalisées
            </h1>

            {data.length > 0 ? (
              <ul>
                {data.map((item) => (
                  <li key={item.id}>
                    <strong>ID:</strong> {item.id}, 
                    <strong> Mouvements:</strong> {item.n_mouvements}, 
                    <strong> Distance:</strong> {item.distance_total}m, 
                    <strong> Temps déplacement:</strong> {item.t_deplacement}s, 
                    <strong> Modèle:</strong> {item.model_id}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chargement des données...</p>
            )}


            <Button
              variant="primary"
              style={{ marginTop: "20px" }}
              onClick={() => navigate("/tests")} // Redirection vers la page Tests
            >
              Voir en détail
            </Button>

          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default About;
