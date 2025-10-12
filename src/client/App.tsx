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
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("open");
      ws.send("Hello from client!");
    };

    ws.onmessage = (event) => {
      console.log("from server:", event.data);
    };

    ws.onclose = () => console.log("close");

    return () => ws.close();
  }, []);

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
