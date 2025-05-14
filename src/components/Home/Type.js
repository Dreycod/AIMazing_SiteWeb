import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Un Projet IA sur un Automate",
          "Fait par: Naoufel, Daniel, André, Esteban",
          "Un projet de fin d'études, une passion partagée.",
          "L'intelligence artificielle qui trouve son chemin.",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
