import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import Map from "./pages/Map/index";
import Pano from "./pages/Pano/index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/cs16" element={<Map />} />
      <Route path="/cs16/pano" element={<Pano />} />
    </Routes>
  );
}
