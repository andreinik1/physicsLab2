import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PendulumLab from "./pages/PendulumLab";
import YoungLab1 from "./pages/YoungLab1";
import YoungLab2 from "./pages/YoungLab2";
import './App.css'



const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pendulum" element={<PendulumLab />} />
      <Route path="/young1" element={<YoungLab1 />} />
      <Route path="/young2" element={<YoungLab2 />} />
    </Routes>
  );
};

export default App;