import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ShowcaseCard";
import Particle from "../Particle";
import ManuelAIvid from "../../Assets/better-manuel.mp4"
import AIvid from "../../Assets/IA.mp4"
import DojoVid from "../../Assets/Dojo.mp4"
import Automate_pic from "../../Assets/Automate.png"
import API_pic from "../../Assets/R.png"

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Les differentes <strong className="purple"> fonctionnalités  </strong> du projet
        </h1>
        <p style={{ color: "white" }}>
          Cliquez pour accèder aux differents Gits du projet
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          
        <Col md={5} className="project-card">
            <ProjectCard
              videoPath={DojoVid}
              isBlog={false}
              title="Entrainement IA"
              description="Application utilisée pour l'entraînement de l'IA du projet"
              ghLink="https://github.com/Dreycod/AImazing_DOJO"
            />
          </Col>

          <Col md={5} className="project-card">
            <ProjectCard
              videoPath={ManuelAIvid}
              isBlog={false}
              title="Labyrinthe Mode Manuel"
              description="Les utilisateurs peuvent jouer pour trouver le chemin de le plus rapide"
              ghLink="https://github.com/Dreycod/AImazing_Maze"
            />
          </Col>
          <Col md={5} className="project-card">
            <ProjectCard
              videoPath={AIvid}
              isBlog={false}
              title="Labyrinthe Mode IA"
              description="Application utilisé pour tester le fonctionnement de l'Intelligence Artificielle du projet"
              ghLink="https://github.com/Dreycod/AImazing_Maze"
            />
          </Col>
          <Col md={5} className="project-card">
            <ProjectCard
              imgPath={Automate_pic}
              isBlog={false}
              title="Automate"
              description="Intelligence du robot du projet IA"
              ghLink="https://github.com/Dreycod/AImazing_Automate"
            />
          </Col>
          <Col md={5} className="project-card">
            <ProjectCard
              imgPath={API_pic}
              isBlog={false}
              title="API"
              description="Moyen de communication entre les fonctionnalités du projet"
              ghLink="https://github.com/Dreycod/AIMazing_API"
            />
          </Col>
          
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
