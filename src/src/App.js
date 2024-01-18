import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Monitoring from "./pages/monitoring/Monitoring";
import Profile from "./pages/profile/Profile";
import Footer from "./components/footer/Footer";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/notFound/NotFound";
import AboutUs from "./pages/aboutUs/AboutUs";
import Forage from "./pages/forage/Forage";

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/forage" element={<Forage />} />
        <Route path="/profile/:idWater/:language?" element={<Profile />} />
        <Route path="/dashboard/:idWp" element={<Dashboard />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
