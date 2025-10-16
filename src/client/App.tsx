import { BrowserRouter, Route, Routes } from "react-router-dom";
import Babylon from "./babylon/Babylon";
import Home from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/babylon" element={<Babylon />} />
        <Route path="/babylon/:roomId" element={<Babylon />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
