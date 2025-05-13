import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SynoptiqueImg from "../../Assets/Synoptique.png"
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
} from "react-icons/ai";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
     
        <Row>
          <Col className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              Description du Projet: <span className="purple"> AI-Mazing </span> 
            </h1>
            
            <Tilt>
              <img src={SynoptiqueImg} className="img-fluid"  alt="avatar" />
            </Tilt>


            <p className="home-about-body">
            Ce projet vise à développer un automate embarqué basé sur une carte type Arduino UNO. Il inclut la gestion de capteurs (gauche, droite, avant, arrière) ou d'une caméra pour détecter l’environnement, ainsi que le contrôle de moteurs pas à pas via des GPIO.
L'automate doit être capable de se déplacer de manière autonome en fonction des données collectées par les capteurs, tout en étant connecté à distance à une <b className="purple"> API via Wi-Fi </b>  pour échanger des informations. Le projet implique plusieurs aspects :
            </p>
          </Col>

        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>Ressources</h1>
            <p>
              Pouvez avoir accès <span className="purple"> au projet (open source) </span> sur le lien github
            </p>
         
              <li className="social-icons">
                <a
                  href="https://github.com/Dreycod/AImazing_DOJO"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
