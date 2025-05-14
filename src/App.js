import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home_Base";
import Projects from "./components/Project/Project_MainPage";
import About from "./components/Details/DetailMainPage";
import Footer from "./components/Footer";
import Tests from "./components/Project/Project_Tests"
import TestVisualization from "./components/Project/TestVisualization"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/"/>} />
          <Route path="/tests" element={<Tests/>} />
          <Route path="/visualization/:testId" element={<TestVisualization />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
