import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Visualization from "./pages/visualization/Visualization";
import Waterprofile from "./pages/waterprofile/Waterprofile";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/waterprofile" element={<Waterprofile />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
