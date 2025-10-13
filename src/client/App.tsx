import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { BabylonCanvas } from "./babylon/BabylonCanvas";
// import { SceneManager } from "./threejs/SceneManager";
// import { GameHUD } from "./ui/GameHUD";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Babylon from "./babylon/Babylon";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/babylon" element={<Babylon />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
