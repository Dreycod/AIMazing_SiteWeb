import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Un Projet IA sur un Automate",
          "Fait par: Naoufel, Daniel, André, Esteban",
          "Fait avec amour lors de notre BTS.",
          "Un projet de fin d'études, une passion partagée.",
          "L'intelligence artificielle qui trouve son chemin.",
          "Conçu pour défier les limites de l'intelligence artificielle.",
          "Un projet ambitieux, né de l'esprit d'innovation.",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
